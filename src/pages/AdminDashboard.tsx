import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { KNOWN_BLACKLIST } from '../../server/mockData';
import { Layers, ShieldAlert, Cpu, Lock, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../utils/blockchain';

export const AdminDashboard: React.FC = () => {
  const { currentRole } = useWeb3();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyber-rose" />
            Protocol Admin & Governance Command Center
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage global threat feeds, smart contract pause triggers, and decentralized AI parameters.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded bg-cyber-rose/15 text-cyber-rose border border-cyber-rose/30">
          Admin Multi-Sig Connected
        </span>
      </div>

      {/* Protocol Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blacklist Manager */}
        <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyber-rose" />
              Global Blacklist & Threat Feed
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {KNOWN_BLACKLIST.length} Seed Entities
            </span>
          </div>

          <div className="space-y-2">
            {KNOWN_BLACKLIST.map((b) => (
              <div
                key={b.address}
                className="p-3 rounded-lg bg-surface-900 border border-slate-800 text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-cyber-rose">{b.address}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{b.reason}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyber-rose/20 text-cyber-rose text-[10px] font-bold">
                  {b.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contract Deployments */}
        <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyber-cyan" />
              Verified Smart Contract Deployments
            </h4>
            <span className="text-[10px] font-mono text-cyber-emerald">EVM Testnets</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-surface-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">FRAUD REGISTRY CONTRACT</span>
              <p className="font-bold text-cyber-cyan truncate">{CONTRACT_ADDRESSES.FraudRegistry}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">REPUTATION CONTRACT</span>
              <p className="font-bold text-cyber-emerald truncate">{CONTRACT_ADDRESSES.ReputationContract}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">FRAUDSHIELD DAO CONTRACT</span>
              <p className="font-bold text-cyber-amber truncate">{CONTRACT_ADDRESSES.FraudShieldDAO}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
