export interface NetworkConfig {
  id: string;
  name: string;
  chainId: number;
  currency: string;
  rpcUrl: string;
  explorerUrl: string;
  isTestnet: boolean;
  color: string;
}

export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  {
    id: 'polygon-amoy',
    name: 'Polygon Amoy',
    chainId: 80002,
    currency: 'POL',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    isTestnet: true,
    color: '#8b5cf6'
  },
  {
    id: 'eth-sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    currency: 'SEP',
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true,
    color: '#3b82f6'
  },
  {
    id: 'arb-sepolia',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    currency: 'ETH',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
    isTestnet: true,
    color: '#00f0ff'
  },
  {
    id: 'hardhat-local',
    name: 'Hardhat Localhost',
    chainId: 31337,
    currency: 'ETH',
    rpcUrl: 'http://127.0.0.1:8545',
    explorerUrl: 'http://localhost:3000/explorer',
    isTestnet: true,
    color: '#10b981'
  }
];

export const CONTRACT_ADDRESSES = {
  FraudRegistry: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  ReputationContract: '0x610178dA2795d00880b2747046566046e7f2A3F6',
  FraudShieldDAO: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
};

export function formatAddress(address: string, digits: number = 4): string {
  if (!address) return '';
  if (address.length <= digits * 2 + 2) return address;
  return `${address.substring(0, digits + 2)}...${address.substring(address.length - digits)}`;
}

export function formatTxHash(hash: string): string {
  if (!hash) return '';
  if (hash.length <= 14) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
}

export function getExplorerTxUrl(txHash: string, networkId: string = 'polygon-amoy'): string {
  const net = SUPPORTED_NETWORKS.find(n => n.id === networkId) || SUPPORTED_NETWORKS[0];
  return `${net.explorerUrl}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string, networkId: string = 'polygon-amoy'): string {
  const net = SUPPORTED_NETWORKS.find(n => n.id === networkId) || SUPPORTED_NETWORKS[0];
  return `${net.explorerUrl}/address/${address}`;
}
