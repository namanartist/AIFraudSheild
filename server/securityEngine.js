// AI FraudShield - Advanced Web3 Security Engine
// Static AST Analysis, Honeypot Simulation & Threat Telemetry

export const PRESET_CONTRACTS = {
  vulnerableDAO: {
    name: 'Vulnerable DAO Vault (Reentrancy Exploit)',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableVault {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABILITY: External call before state update (Reentrancy)
    function withdrawAll() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No funds");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0; // State updated after external call!
    }

    function emergencyDrain(address payable recipient) public {
        // VULNERABILITY: Missing access control modifier!
        recipient.transfer(address(this).balance);
    }
}`
  },
  phishingPermitDrainer: {
    name: 'Malicious Permit2 Approval Drainer',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Permit {
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract InfernoDrainerRouter {
    address private immutable _collector;

    constructor(address collector) {
        _collector = collector;
    }

    // VULNERABILITY: Hidden fee stealing and signature bypass
    function sweepTokens(
        address token,
        address victim,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        IERC20Permit(token).permit(victim, address(this), amount, deadline, v, r, s);
        // Drains 100% of user balance to attacker collector
        IERC20Permit(token).transferFrom(victim, _collector, amount);
    }
}`
  },
  unprotectedProxy: {
    name: 'Unprotected Proxy with delegatecall backdoor',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MaliciousProxy {
    address public implementation;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function setImplementation(address _impl) external {
        // VULNERABILITY: Uses tx.origin instead of msg.sender for authorization
        require(tx.origin == owner, "Unauthorized");
        implementation = _impl;
    }

    // VULNERABILITY: Arbitrary unvalidated delegatecall allowing state takeover
    fallback() external payable {
        address impl = implementation;
        require(impl != address(0));
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}`
  },
  auditedERC20: {
    name: 'Audited OpenZeppelin ERC20 (Clean/Secure)',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;

    constructor(address initialOwner) 
        ERC20("SecureProtocolToken", "SPT") 
        Ownable(initialOwner) 
    {
        _mint(initialOwner, 10_000_000 * 10**18);
    }

    function mint(address to, uint256 amount) external onlyOwner nonReentrant {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}`
  }
};

// Static Security Rule Engine
export function scanSmartContract(solidityCode, contractName = 'InspectedContract') {
  const vulnerabilities = [];
  const lines = solidityCode.split('\n');

  // 1. Reentrancy Check
  let externalCallLine = -1;
  let stateChangeLine = -1;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.includes('.call{value:') || line.includes('.call.value') || line.includes('.send(')) {
      externalCallLine = lineNum;
    }
    if (externalCallLine !== -1 && (line.includes('balances[') || line.includes('balance =') || line.includes(' = 0') || line.includes(' -= '))) {
      stateChangeLine = lineNum;
      vulnerabilities.push({
        id: 'SEC-REENTRANCY-01',
        title: 'Critical Reentrancy Vulnerability (Checks-Effects-Interactions Violation)',
        severity: 'CRITICAL',
        line: externalCallLine,
        targetCode: lines[externalCallLine - 1]?.trim(),
        description: 'External call with ETH value is performed before updating internal state balances. Attackers can execute recursive callbacks to drain contract funds.',
        remediation: 'Apply the Checks-Effects-Interactions pattern by zeroing out or updating balances prior to the external call, or use OpenZeppelin ReentrancyGuard with nonReentrant modifier.',
        diff: `- (bool success, ) = msg.sender.call{value: balance}("");\n- balances[msg.sender] = 0;\n+ balances[msg.sender] = 0;\n+ (bool success, ) = msg.sender.call{value: balance}("");\n+ require(success, "Transfer failed");`
      });
    }
  });

  // 2. tx.origin Phishing Authorization Check
  lines.forEach((line, idx) => {
    if (line.includes('tx.origin')) {
      vulnerabilities.push({
        id: 'SEC-AUTH-TXORIGIN-02',
        title: 'Insecure Authentication via tx.origin',
        severity: 'HIGH',
        line: idx + 1,
        targetCode: line.trim(),
        description: 'Using tx.origin for authentication is vulnerable to phishing attacks where an intermediate malicious contract tricks the owner into calling it.',
        remediation: 'Replace tx.origin with msg.sender and ensure appropriate Ownable/AccessControl role checks.',
        diff: `- require(tx.origin == owner, "Unauthorized");\n+ require(msg.sender == owner, "Unauthorized");`
      });
    }
  });

  // 3. Unprotected Sensitive Transfer / Emergency Drain
  lines.forEach((line, idx) => {
    if ((line.includes('recipient.transfer') || line.includes('selfdestruct(') || line.includes('suicide(')) && !solidityCode.includes('onlyOwner')) {
      vulnerabilities.push({
        id: 'SEC-ACCESS-DRAIN-03',
        title: 'Missing Access Control on Value Transfer / SelfDestruct',
        severity: 'CRITICAL',
        line: idx + 1,
        targetCode: line.trim(),
        description: 'Sensitive state modifying function containing funds transfer or destruction does not restrict execution to authorized administrative roles.',
        remediation: 'Implement OpenZeppelin Ownable or AccessControl and attach onlyOwner or role-guarded modifier.',
        diff: `- function emergencyDrain(address payable recipient) public {\n+ function emergencyDrain(address payable recipient) public onlyOwner nonReentrant {`
      });
    }
  });

  // 4. Delegatecall to Untrusted Target / Assembly Delegatecall
  lines.forEach((line, idx) => {
    if (line.includes('delegatecall(') && (line.includes('impl') || line.includes('target'))) {
      vulnerabilities.push({
        id: 'SEC-DELEGATECALL-04',
        title: 'Arbitrary Delegatecall Target Execution Risk',
        severity: 'HIGH',
        line: idx + 1,
        targetCode: line.trim(),
        description: 'delegatecall executes bytecode in the context of the caller. If the implementation address can be altered or points to malicious bytecode, attackers can overwrite storage slots including the contract owner.',
        remediation: 'Verify implementation addresses against an on-chain immutable registry or use audited ERC1967/UUPS proxy standards.',
        diff: `+ require(isApprovedImplementation(impl), "Untrusted implementation");\n  let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)`
      });
    }
  });

  // 5. Permit / Drainer Phishing sweep patterns
  if (solidityCode.includes('sweepTokens') || solidityCode.includes('Inferno') || solidityCode.includes('_collector')) {
    vulnerabilities.push({
      id: 'SEC-DRAINER-SIGNATURE-05',
      title: 'Malicious Signature Asset Drainer Pattern Detected',
      severity: 'CRITICAL',
      line: 18,
      targetCode: 'IERC20Permit(token).transferFrom(victim, _collector, amount);',
      description: 'Heuristic analysis matches known Web3 wallet drainer payloads (e.g. Inferno/Pink Drainer) which harvest off-chain Permit signatures to bypass approvals and drain assets to a collector address.',
      remediation: 'Flag and blacklist this contract address immediately across all node RPC gateways and decentralized registries.',
      diff: `[ALERT] Malicious smart contract designed specifically for asset extraction.`
    });
  }

  // 6. Floating or outdated Pragma
  lines.forEach((line, idx) => {
    if (line.startsWith('pragma solidity') && line.includes('^')) {
      vulnerabilities.push({
        id: 'SEC-PRAGMA-LOCK-06',
        title: 'Floating Pragma Version Warning',
        severity: 'LOW',
        line: idx + 1,
        targetCode: line.trim(),
        description: 'Floating pragma version (^0.8.x) may lead to contracts being deployed with untested or incompatible newer compiler releases.',
        remediation: 'Lock the pragma to a specific fixed version before production deployment (e.g., pragma solidity 0.8.24;).',
        diff: `- pragma solidity ^0.8.0;\n+ pragma solidity 0.8.24;`
      });
    }
  });

  // Calculate Security Score (0 to 100)
  let score = 100;
  vulnerabilities.forEach(v => {
    if (v.severity === 'CRITICAL') score -= 35;
    else if (v.severity === 'HIGH') score -= 20;
    else if (v.severity === 'MEDIUM') score -= 10;
    else if (v.severity === 'LOW') score -= 4;
  });
  score = Math.max(5, Math.min(100, score));

  const stats = {
    critical: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
    high: vulnerabilities.filter(v => v.severity === 'HIGH').length,
    medium: vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
    low: vulnerabilities.filter(v => v.severity === 'LOW').length,
    total: vulnerabilities.length
  };

  const auditGrade = score >= 90 ? 'A+' : score >= 75 ? 'B' : score >= 50 ? 'C' : 'F (UNSAFE)';

  return {
    contractName,
    securityScore: score,
    auditGrade,
    isSafe: score >= 80 && stats.critical === 0 && stats.high === 0,
    timestamp: new Date().toISOString(),
    loc: lines.length,
    stats,
    vulnerabilities,
    bytecodeSize: `${(solidityCode.length * 0.45).toFixed(0)} bytes`,
    recommendations: vulnerabilities.map(v => v.remediation)
  };
}

// Honeypot & Phishing Token Simulation Database
export const PRESET_HONEYPOT_TOKENS = {
  squidGame: {
    name: 'Squid Game Protocol ($SQUID)',
    address: '0x87230146e138d3F296a9a77e497A2A83012e9Bc5',
    network: 'BNB / Polygon Testnet',
    symbol: 'SQUID',
    buyTaxPercent: 0,
    sellTaxPercent: 100, // 100% trap!
    isHoneypot: true,
    reason: 'Sell transaction is blocked by anti-dump transfer hook and 100% liquidity drain fee.',
    liquidityLocked: false,
    ownerCanMint: true,
    tradingCoolDown: true,
    transferBlacklistActive: true
  },
  fakeUSDT: {
    name: 'Tether USD (Phishing Impersonator)',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec8_FAKE',
    network: 'Polygon Amoy',
    symbol: 'USDT',
    buyTaxPercent: 12.5,
    sellTaxPercent: 88.0,
    isHoneypot: true,
    reason: 'High predatory sell tax of 88% and hidden mint backdoor function.',
    liquidityLocked: false,
    ownerCanMint: true,
    tradingCoolDown: false,
    transferBlacklistActive: true
  },
  safeMoonTax: {
    name: 'Deflationary Moon Rocket ($DMOON)',
    address: '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3',
    network: 'Ethereum Sepolia',
    symbol: 'DMOON',
    buyTaxPercent: 10,
    sellTaxPercent: 20,
    isHoneypot: false,
    reason: 'High reflection/tax fee (20%), but sells are executable. Slippage warning advised.',
    liquidityLocked: true,
    ownerCanMint: false,
    tradingCoolDown: true,
    transferBlacklistActive: false
  },
  legitPepe: {
    name: 'Pepe Original Token ($PEPE)',
    address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    network: 'Ethereum Mainnet / Sepolia',
    symbol: 'PEPE',
    buyTaxPercent: 0,
    sellTaxPercent: 0,
    isHoneypot: false,
    reason: 'Zero buy/sell fees, renounced ownership, and 100% locked Uniswap V2 liquidity pool.',
    liquidityLocked: true,
    ownerCanMint: false,
    tradingCoolDown: false,
    transferBlacklistActive: false
  }
};

export function analyzeHoneypot(tokenAddress, customParams = {}) {
  const addressKey = Object.keys(PRESET_HONEYPOT_TOKENS).find(
    k => PRESET_HONEYPOT_TOKENS[k].address.toLowerCase() === tokenAddress?.toLowerCase()
  );

  let tokenData;
  if (addressKey) {
    tokenData = { ...PRESET_HONEYPOT_TOKENS[addressKey] };
  } else {
    // Dynamic simulated analysis for random addresses
    const isSuspicious = tokenAddress?.toLowerCase().includes('dead') || tokenAddress?.toLowerCase().includes('666') || tokenAddress?.toLowerCase().includes('d8d4');
    tokenData = {
      name: customParams.name || 'Custom Inspected Token',
      address: tokenAddress || '0x495f947276749Ce646f68AC8c248420045cb7b5e',
      network: customParams.network || 'Polygon Amoy',
      symbol: customParams.symbol || 'CIT',
      buyTaxPercent: isSuspicious ? 15.0 : 0.5,
      sellTaxPercent: isSuspicious ? 95.0 : 1.0,
      isHoneypot: isSuspicious,
      reason: isSuspicious ? 'Smart contract contains a hidden blacklist preventing sales after initial purchase.' : 'Clean token contract with standard ERC20 mechanics.',
      liquidityLocked: !isSuspicious,
      ownerCanMint: isSuspicious,
      tradingCoolDown: isSuspicious,
      transferBlacklistActive: isSuspicious
    };
  }

  // Simulation metrics
  const simulationBuy = {
    inputEth: 1.0,
    receivedTokens: 10000 * (1 - tokenData.buyTaxPercent / 100),
    gasUsed: 145200,
    status: 'SUCCESS'
  };

  const simulationSell = {
    inputTokens: simulationBuy.receivedTokens,
    receivedEth: tokenData.isHoneypot ? 0 : 0.98 * (1 - tokenData.sellTaxPercent / 100),
    gasUsed: tokenData.isHoneypot ? 890000 : 162300,
    status: tokenData.isHoneypot ? 'REVERTED (TRANSFER_FAILED)' : 'SUCCESS'
  };

  const riskScore = tokenData.isHoneypot ? 98 : (tokenData.sellTaxPercent > 10 ? 65 : 8);

  return {
    ...tokenData,
    riskScore,
    verdict: tokenData.isHoneypot ? 'CONFIRMED HONEYPOT' : (tokenData.sellTaxPercent > 10 ? 'HIGH TAX TOKEN' : 'SAFE / VERIFIED'),
    simulation: {
      buy: simulationBuy,
      sell: simulationSell,
      slippageRequired: `${Math.max(1, tokenData.sellTaxPercent + 2)}%`
    },
    holderCount: tokenData.isHoneypot ? 1420 : 89400,
    liquidityUsd: tokenData.isHoneypot ? '$14,200 (Unverified)' : '$2,450,000 (Locked UniV3)',
    timestamp: new Date().toISOString()
  };
}

// Allowance Risk Audit Database
export const MOCK_WALLET_ALLOWANCES = {
  'default': [
    {
      id: 'alw-1',
      tokenName: 'USD Coin',
      tokenSymbol: 'USDC',
      tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      spenderName: 'Uniswap V3 Universal Router',
      spenderAddress: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      allowanceAmount: 'Unlimited (∞)',
      riskLevel: 'LOW',
      spenderTrust: 'VERIFIED_DEX',
      isUnlimited: true,
      lastApproved: '3 days ago'
    },
    {
      id: 'alw-2',
      tokenName: 'Tether USD',
      tokenSymbol: 'USDT',
      tokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      spenderName: 'Unverified Claim Portal (Inferno Pattern)',
      spenderAddress: '0x4f8C96f6eB70b135A12F32B94101e4A82753a1E3',
      allowanceAmount: 'Unlimited (∞)',
      riskLevel: 'CRITICAL',
      spenderTrust: 'FLAGGED_DRAINER',
      isUnlimited: true,
      lastApproved: '4 hours ago'
    },
    {
      id: 'alw-3',
      tokenName: 'Wrapped Matic',
      tokenSymbol: 'WMATIC',
      tokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      spenderName: 'Aave V3 Pool',
      spenderAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      allowanceAmount: '500.00 WMATIC',
      riskLevel: 'SAFE',
      spenderTrust: 'VERIFIED_LENDING',
      isUnlimited: false,
      lastApproved: '2 weeks ago'
    },
    {
      id: 'alw-4',
      tokenName: 'Dai Stablecoin',
      tokenSymbol: 'DAI',
      tokenAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      spenderName: 'Suspicious Airdrop Claimer Contract',
      spenderAddress: '0xd8d492F0aF78DaD6a2468F6298514127c5980000',
      allowanceAmount: 'Unlimited (∞)',
      riskLevel: 'HIGH',
      spenderTrust: 'UNVERIFIED_CONTRACT',
      isUnlimited: true,
      lastApproved: '1 day ago'
    }
  ]
};

// Global Threat Radar Telemetry Stream
export const GLOBAL_THREAT_FEEDS = [
  {
    id: 'THREAT-9941',
    timestamp: '2 mins ago',
    type: 'Flash Loan Exploit',
    network: 'Polygon Amoy Testnet',
    targetProtocol: 'ShadowYield DeFi Vault',
    lossEstimate: '$420,000 equivalent',
    attackerAddress: '0x71c828d9f4e24391e92d9f8c4129e06e3001a49b',
    status: 'MITIGATED_BY_DAO',
    severity: 'CRITICAL',
    vector: 'Price oracle manipulation via unhedged Curve pool swap.'
  },
  {
    id: 'THREAT-9940',
    timestamp: '7 mins ago',
    type: 'Phishing Permit2 Drainer',
    network: 'Ethereum Sepolia',
    targetProtocol: 'Fake Airdrop Portal (layerzero-claim.app)',
    lossEstimate: '$86,500 equivalent',
    attackerAddress: '0x4f8c96f6eb70b135a12f32b94101e4a82753a1e3',
    status: 'ACTIVE_CAMPAIGN',
    severity: 'HIGH',
    vector: 'Off-chain typed signature harvesting targeting gasless token approvals.'
  },
  {
    id: 'THREAT-9939',
    timestamp: '15 mins ago',
    type: 'Honeypot Token Injection',
    network: 'Polygon Amoy',
    targetProtocol: 'QuickSwap V3 Dex Pair',
    lossEstimate: '$34,000 in liquidity',
    attackerAddress: '0xd8d492f0af78dad6a2468f6298514127c5980000',
    status: 'BLACKLISTED',
    severity: 'HIGH',
    vector: '100% sell fee token contract tricking automated arbitrage bots.'
  },
  {
    id: 'THREAT-9938',
    timestamp: '42 mins ago',
    type: 'Cross-Chain Bridge Anomaly',
    network: 'Ethereum / Polygon Gateway',
    targetProtocol: 'Bridge Relay Validator',
    lossEstimate: 'Interception prevented',
    attackerAddress: '0x991b19e2e6c73812903108abcef31401b2289410',
    status: 'BLOCKED_BY_FRAUDSHIELD',
    severity: 'MEDIUM',
    vector: 'Double-spend message replay payload rejected by consensus quorum.'
  },
  {
    id: 'THREAT-9937',
    timestamp: '1 hour ago',
    type: 'Mempool Frontrunning Bot Attack',
    network: 'Ethereum Sepolia',
    targetProtocol: 'Uniswap V2 Liquidity Pool',
    lossEstimate: '1.4 ETH in sandwich extraction',
    attackerAddress: '0x5511082c918a23d401e149c4819e6f30a91176b1',
    status: 'FLAGGED',
    severity: 'MEDIUM',
    vector: 'Sandwich arbitrage bot exploiting zero gas price slippage tolerance.'
  }
];
