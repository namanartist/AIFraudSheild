// Mock dataset for AI FraudShield containing high-risk addresses, synthetic transactions,
// registered fraud reports, validator profiles, and IPFS evidence records.

export const KNOWN_BLACKLIST = [
  { address: '0x71C...a49B', reason: 'Tornado Cash Mixer Associated Relayer', severity: 'HIGH' },
  { address: '0xd8d...0000', reason: 'Inferno Drainer Phishing Contract', severity: 'CRITICAL' },
  { address: '0x4f8...b912', reason: 'Flash Loan Reentrancy Exploiter', severity: 'CRITICAL' },
  { address: '0x992...f7aa', reason: 'Fake Uniswap V3 Permit Stealer', severity: 'HIGH' },
  { address: '0x133...e421', reason: 'Known Sybil AirDrop Bot Cluster', severity: 'MEDIUM' }
];

export const INITIAL_WALLETS = {
  '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B': {
    address: '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B',
    label: 'Alice (Demo User)',
    role: 'User',
    reputationScore: 92,
    riskLevel: 'LOW',
    totalAnalyzedTx: 148,
    verifiedFraudReports: 0,
    falseReports: 0,
    lastActivity: '2 mins ago',
    walletAgeDays: 420,
    behavioralMetrics: {
      avgAmountEth: 0.45,
      frequencyPerHour: 1.2,
      gasAnomalyIndex: 0.05,
      mixerProximity: 0.0,
      contractCallRatio: 0.35,
      recipientEntropy: 0.88
    }
  },
  '0x3A289bFE26A18d9633e79e65839C726f16E491eE': {
    address: '0x3A289bFE26A18d9633e79e65839C726f16E491eE',
    label: 'Marcus Vance (CertiK Lead)',
    role: 'Investigator',
    reputationScore: 98,
    riskLevel: 'LOW',
    totalAnalyzedTx: 1240,
    verifiedFraudReports: 34,
    falseReports: 1,
    lastActivity: 'Just now',
    walletAgeDays: 890,
    behavioralMetrics: {
      avgAmountEth: 2.1,
      frequencyPerHour: 4.5,
      gasAnomalyIndex: 0.02,
      mixerProximity: 0.0,
      contractCallRatio: 0.72,
      recipientEntropy: 0.95
    }
  },
  '0x9F41FfB0b64d1C5e3c880193498801948842c812': {
    address: '0x9F41FfB0b64d1C5e3c880193498801948842c812',
    label: 'DAO Consensus Validator #04',
    role: 'Validator',
    reputationScore: 96,
    riskLevel: 'LOW',
    totalAnalyzedTx: 3420,
    verifiedFraudReports: 89,
    falseReports: 0,
    lastActivity: '5 mins ago',
    walletAgeDays: 710,
    behavioralMetrics: {
      avgAmountEth: 0.0,
      frequencyPerHour: 8.0,
      gasAnomalyIndex: 0.01,
      mixerProximity: 0.0,
      contractCallRatio: 0.98,
      recipientEntropy: 0.99
    }
  },
  '0x11B3c47eA7338C6C92e319119A619082260277d0': {
    address: '0x11B3c47eA7338C6C92e319119A619082260277d0',
    label: 'Protocol Security Admin',
    role: 'Admin',
    reputationScore: 100,
    riskLevel: 'TRUSTED',
    totalAnalyzedTx: 820,
    verifiedFraudReports: 0,
    falseReports: 0,
    lastActivity: '12 mins ago',
    walletAgeDays: 1050,
    behavioralMetrics: {
      avgAmountEth: 5.0,
      frequencyPerHour: 2.0,
      gasAnomalyIndex: 0.0,
      mixerProximity: 0.0,
      contractCallRatio: 0.85,
      recipientEntropy: 0.9
    }
  },
  '0xd8d4F3879a978680d28765275e7A837f48e30000': {
    address: '0xd8d4F3879a978680d28765275e7A837f48e30000',
    label: 'Flagged Drainer Sybil #09',
    role: 'Flagged',
    reputationScore: 12,
    riskLevel: 'HIGH',
    totalAnalyzedTx: 34,
    verifiedFraudReports: 14,
    falseReports: 0,
    lastActivity: '1 hour ago',
    walletAgeDays: 3,
    behavioralMetrics: {
      avgAmountEth: 48.5,
      frequencyPerHour: 42.0,
      gasAnomalyIndex: 0.94,
      mixerProximity: 0.88,
      contractCallRatio: 0.96,
      recipientEntropy: 0.08
    }
  }
};

export const INITIAL_REPORTS = [
  {
    reportId: 101,
    targetWallet: '0xd8d4F3879a978680d28765275e7A837f48e30000',
    txHash: '0x9a8f21e5b8d774a1239bc7a9e01f5682910fae13d987e914cb2990aa415c8921',
    network: 'Polygon Amoy',
    amountEth: 85.0,
    aiRiskScore: 94,
    aiDiagnosisSummary: 'Sudden high-velocity bulk transfer to unverified drainer contract with elevated gas price and high mixer proximity.',
    riskCategory: 'CRITICAL_DRAIN',
    ipfsEvidenceCID: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    evidenceTitle: 'Inferno Phishing Batch Analysis Dossier',
    evidenceType: 'application/json',
    evidenceFileSize: '142.8 KB',
    reporter: '0x3A289bFE26A18d9633e79e65839C726f16E491eE',
    reporterRole: 'Lead Security Investigator',
    timestamp: Date.now() - 3600000 * 4,
    status: 'Voting',
    yesVotes: 2,
    noVotes: 0,
    requiredQuorum: 3,
    isResolved: false,
    aiConfidence: 0.97
  },
  {
    reportId: 102,
    targetWallet: '0x4f8C9b218B82eA819283749281a812838183b912',
    txHash: '0x3c21a4f910e98716b5a3298cde47102938475a6102938475b6a7c8d9e0f1a234',
    network: 'Ethereum Sepolia',
    amountEth: 12.8,
    aiRiskScore: 68,
    aiDiagnosisSummary: 'Unusual contract interaction timing with newly deployed unverified router.',
    riskCategory: 'SUSPICIOUS_ROUTING',
    ipfsEvidenceCID: 'bafybeihkoviema7g3j7uqy36u7t33f7cvy2vqu562k4pmsq5y7s2f7hveq',
    evidenceTitle: 'Router Execution Trace & Decompiled Bytecode',
    evidenceType: 'application/pdf',
    evidenceFileSize: '884.2 KB',
    reporter: '0x3A289bFE26A18d9633e79e65839C726f16E491eE',
    reporterRole: 'Lead Security Investigator',
    timestamp: Date.now() - 3600000 * 18,
    status: 'Voting',
    yesVotes: 1,
    noVotes: 1,
    requiredQuorum: 3,
    isResolved: false,
    aiConfidence: 0.88
  },
  {
    reportId: 100,
    targetWallet: '0x992384718293487192834719283471928347f7aa',
    txHash: '0x7b10293847561029384756a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    network: 'Arbitrum Sepolia',
    amountEth: 142.5,
    aiRiskScore: 98,
    aiDiagnosisSummary: 'Verified permit phishing exploit draining multi-signature collateral pool.',
    riskCategory: 'PERMIT_EXPLOIT',
    ipfsEvidenceCID: 'bafybeih5glg3t6g7l47k56o5v3w3v7x6o5v3w3v7x6o5v3w3v7x6o5v3w3',
    evidenceTitle: 'Permit Phishing Forensic Trace & Victim Affidavit',
    evidenceType: 'application/zip',
    evidenceFileSize: '2.4 MB',
    reporter: '0x3A289bFE26A18d9633e79e65839C726f16E491eE',
    reporterRole: 'Lead Security Investigator',
    timestamp: Date.now() - 3600000 * 48,
    status: 'Verified',
    yesVotes: 4,
    noVotes: 0,
    requiredQuorum: 3,
    isResolved: true,
    aiConfidence: 0.99
  }
];

export const SAMPLE_MEMPOOL_TRANSACTIONS = [
  {
    txHash: '0x82A4...91F2',
    from: '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B',
    to: '0xd8d4F3879a978680d28765275e7A837f48e30000',
    amount: '2.83 ETH',
    amountValue: 2.83,
    riskScore: 78,
    status: 'Flagged',
    timestamp: '10s ago',
    type: 'High-Risk Transfer',
    gasGwei: 42
  },
  {
    txHash: '0x55B1...12C9',
    from: '0x3A289bFE26A18d9633e79e65839C726f16E491eE',
    to: '0x9F41FfB0b64d1C5e3c880193498801948842c812',
    amount: '0.12 ETH',
    amountValue: 0.12,
    riskScore: 12,
    status: 'Clean',
    timestamp: '25s ago',
    type: 'DAO Staking Action',
    gasGwei: 28
  },
  {
    txHash: '0x99F0...E882',
    from: '0xd8d4F3879a978680d28765275e7A837f48e30000',
    to: '0x4f8C9b218B82eA819283749281a812838183b912',
    amount: '85.0 ETH',
    amountValue: 85.0,
    riskScore: 94,
    status: 'Critical Alert',
    timestamp: '42s ago',
    type: 'Whale Drain Spike',
    gasGwei: 180
  },
  {
    txHash: '0x12C0...44FA',
    from: '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B',
    to: '0x Uniswap V3 Pool',
    amount: '0.45 ETH',
    amountValue: 0.45,
    riskScore: 18,
    status: 'Clean',
    timestamp: '1m ago',
    type: 'DEX Swap',
    gasGwei: 31
  },
  {
    txHash: '0x33A9...77BC',
    from: '0x00a891...38b1',
    to: '0x992384718293487192834719283471928347f7aa',
    amount: '14.2 ETH',
    amountValue: 14.2,
    riskScore: 67,
    status: 'Suspicious',
    timestamp: '2m ago',
    type: 'Tornado Mixer Inflow',
    gasGwei: 75
  }
];
