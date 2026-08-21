import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { SUPPORTED_NETWORKS, CONTRACT_ADDRESSES } from '../utils/blockchain';
import { Settings, Globe, Droplets, CheckCircle2, Copy, FileCode, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentNetwork, switchNetwork, requestFaucet, balance } = useWeb3();
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-300" />
          Network Settings & Smart Contract ABIs
        </h2>
        <p className="text-xs font-mono text-slate-400 mt-0.5">
          Configure blockchain RPC endpoints, testnet faucets, and inspect verified smart contract interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Configurations */}
        <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyber-purple" />
              Supported EVM Networks
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Multi-Chain</span>
          </div>

          <div className="space-y-3">
            {SUPPORTED_NETWORKS.map((net) => {
              const isSelected = net.id === currentNetwork.id;
              return (
                <div
                  key={net.id}
                  onClick={() => switchNetwork(net.id)}
                  className={`p-3.5 rounded-xl border font-mono text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface-850 border-cyber-cyan text-white shadow-sm'
                      : 'bg-surface-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{net.name}</span>
                    {isSelected && (
                      <span className="text-[10px] text-cyber-cyan font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Chain ID: {net.chainId}</span>
                    <span>RPC: {net.rpcUrl}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={requestFaucet}
              className="w-full py-2.5 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-cyber-cyan font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Droplets className="w-4 h-4" />
              <span>Claim Testnet Faucet (+2.5 {currentNetwork.currency})</span>
            </button>
          </div>
        </div>

        {/* Smart Contract ABIs & Addresses */}
        <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyber-cyan" />
              Smart Contract Deployment Addresses
            </h4>
            <span className="text-[10px] font-mono text-cyber-emerald">Solidity 0.8.20</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
              <div key={name} className="p-3 rounded-xl bg-surface-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>{name}</span>
                  <button
                    onClick={() => handleCopy(addr, name)}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {copied === name ? (
                      <span className="text-cyber-emerald flex items-center gap-1">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </span>
                    )}
                  </button>
                </div>
                <p className="font-bold text-cyber-cyan text-xs break-all">{addr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
