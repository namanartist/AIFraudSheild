import React from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { SUPPORTED_NETWORKS, formatAddress } from '../../utils/blockchain';
import { X, Wallet, CheckCircle2, Globe, Droplets, ExternalLink } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const {
    address,
    balance,
    currentNetwork,
    switchNetwork,
    connectWallet,
    disconnectWallet,
    requestFaucet,
    isRealWalletConnected
  } = useWeb3();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-surface-950 border border-cyber-cyan/30 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-cyan/10 text-cyber-cyan">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Web3 Wallet Interface</h3>
              <p className="text-xs text-slate-400 font-mono">Status: Connected ({isRealWalletConnected ? 'MetaMask' : 'Simulated Persona'})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Wallet Box */}
        <div className="my-5 p-4 rounded-xl bg-surface-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ACTIVE ADDRESS</span>
            <span className="flex items-center gap-1 text-cyber-emerald">
              <CheckCircle2 className="w-3.5 h-3.5" />
              EVM TESTNET READY
            </span>
          </div>
          <p className="font-mono text-sm font-bold text-white mt-1 break-all">{address}</p>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400">TESTNET BALANCE</span>
              <p className="text-lg font-bold font-mono text-cyber-cyan">{balance}</p>
            </div>
            <button
              onClick={requestFaucet}
              className="px-3 py-1.5 rounded-lg bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>+2.5 Faucet</span>
            </button>
          </div>
        </div>

        {/* Network Switcher */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyber-purple" />
            Switch Active Network
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_NETWORKS.map((net) => {
              const isSelected = net.id === currentNetwork.id;
              return (
                <button
                  key={net.id}
                  onClick={() => switchNetwork(net.id)}
                  className={`p-2.5 rounded-lg border text-left font-mono text-xs transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-surface-850 border-cyber-cyan text-white shadow-sm'
                      : 'bg-surface-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-white">{net.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Chain ID: {net.chainId}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              connectWallet();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold transition-all"
          >
            Connect MetaMask
          </button>
          <button
            onClick={() => {
              disconnectWallet();
              onClose();
            }}
            className="py-2.5 px-4 rounded-xl bg-surface-900 hover:bg-surface-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
