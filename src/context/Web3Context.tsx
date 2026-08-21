import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { SUPPORTED_NETWORKS, NetworkConfig } from '../utils/blockchain';

export interface Persona {
  role: UserRole;
  name: string;
  address: string;
  balance: string;
  avatar: string;
  tagline: string;
}

export const DEMO_PERSONAS: Persona[] = [
  {
    role: 'User',
    name: 'Alice (Regular Web3 User)',
    address: '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B',
    balance: '4.85 ETH',
    avatar: '👤',
    tagline: 'Standard DeFi Trader & NFT Collector'
  },
  {
    role: 'Investigator',
    name: 'Marcus Vance (CertiK Lead)',
    address: '0x3A289bFE26A18d9633e79e65839C726f16E491eE',
    balance: '28.40 ETH',
    avatar: '🕵️',
    tagline: 'Certified On-Chain Security Forensics'
  },
  {
    role: 'Validator',
    name: 'DAO Consensus Validator #04',
    address: '0x9F41FfB0b64d1C5e3c880193498801948842c812',
    balance: '150.00 POL',
    avatar: '⚖️',
    tagline: 'Staked Validator with 10k $SHIELD Quorum Power'
  },
  {
    role: 'Admin',
    name: 'Protocol Security Admin',
    address: '0x11B3c47eA7338C6C92e319119A619082260277d0',
    balance: '500.00 ETH',
    avatar: '🛡️',
    tagline: 'FraudShield Governance Multi-Sig Overseer'
  }
];

interface Web3ContextType {
  isConnected: boolean;
  address: string;
  balance: string;
  currentRole: UserRole;
  activePersona: Persona;
  currentNetwork: NetworkConfig;
  isMetaMaskAvailable: boolean;
  isRealWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchRole: (role: UserRole) => void;
  switchNetwork: (networkId: string) => void;
  requestFaucet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<Persona>(DEMO_PERSONAS[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('User');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig>(SUPPORTED_NETWORKS[0]);
  const [isRealWalletConnected, setIsRealWalletConnected] = useState<boolean>(false);
  const [realAddress, setRealAddress] = useState<string>('');
  const [realBalance, setRealBalance] = useState<string>('0.00 ETH');

  const isMetaMaskAvailable = typeof window !== 'undefined' && Boolean((window as any).ethereum);

  const connectWallet = async () => {
    if (isMetaMaskAvailable) {
      try {
        const ethereum = (window as any).ethereum;
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setRealAddress(accounts[0]);
          setIsRealWalletConnected(true);
          setIsConnected(true);
          setRealBalance('3.42 POL');
          return;
        }
      } catch (err) {
        console.warn('MetaMask connection rejected, using demo persona:', err);
      }
    }
    // Default fallback to connected demo persona
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsRealWalletConnected(false);
    setRealAddress('');
    setIsConnected(false);
  };

  const switchRole = (role: UserRole) => {
    const persona = DEMO_PERSONAS.find(p => p.role === role) || DEMO_PERSONAS[0];
    setActivePersona(persona);
    setCurrentRole(role);
    setIsConnected(true);
    setIsRealWalletConnected(false);
  };

  const switchNetwork = (networkId: string) => {
    const net = SUPPORTED_NETWORKS.find(n => n.id === networkId) || SUPPORTED_NETWORKS[0];
    setCurrentNetwork(net);
  };

  const requestFaucet = () => {
    const currentNum = parseFloat(activePersona.balance);
    const newBal = `${(currentNum + 2.5).toFixed(2)} ${currentNetwork.currency}`;
    setActivePersona(prev => ({ ...prev, balance: newBal }));
  };

  const currentAddress = isRealWalletConnected ? realAddress : activePersona.address;
  const currentBalance = isRealWalletConnected ? realBalance : activePersona.balance;

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address: currentAddress,
        balance: currentBalance,
        currentRole,
        activePersona,
        currentNetwork,
        isMetaMaskAvailable,
        isRealWalletConnected,
        connectWallet,
        disconnectWallet,
        switchRole,
        switchNetwork,
        requestFaucet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
