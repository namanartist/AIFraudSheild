import React from 'react';
import {
  Wallet,
  Activity,
  Cpu,
  ShieldAlert,
  FileCheck,
  Database,
  Blocks,
  Scale,
  Award,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useFraudShield } from '../../context/FraudShieldContext';

export const WorkflowVisualizer: React.FC = () => {
  const { activeDemoStep } = useFraudShield();

  const steps = [
    { id: 1, title: 'Connect Wallet', subtitle: 'Web3 Auth', icon: Wallet, color: 'cyan' },
    { id: 2, title: 'Tx Detection', subtitle: 'Mempool Stream', icon: Activity, color: 'blue' },
    { id: 3, title: 'Feature Extract', subtitle: 'Behavior & Gas', icon: Cpu, color: 'purple' },
    { id: 4, title: 'AI Risk Engine', subtitle: 'Isolation & XGBoost', icon: ShieldAlert, color: 'rose' },
    { id: 5, title: 'IPFS Evidence', subtitle: 'Immutable CID', icon: Database, color: 'teal' },
    { id: 6, title: 'Smart Contract', subtitle: 'FraudRegistry.sol', icon: Blocks, color: 'indigo' },
    { id: 7, title: 'DAO Quorum', subtitle: 'Validator Votes', icon: Scale, color: 'amber' },
    { id: 8, title: 'Reputation', subtitle: 'Reputation.sol', icon: Award, color: 'emerald' },
    { id: 9, title: 'AI Feedback', subtitle: 'Retrain Loop', icon: RefreshCw, color: 'cyan' }
  ];

  return (
    <div className="glass-panel p-5 border border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            End-to-End Decentralized Pipeline
          </h4>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Cryptographic Flow: AI Anomaly → IPFS Hash → EVM State → DAO Consensus → Retraining Loop
          </p>
        </div>
        {activeDemoStep && (
          <span className="px-2.5 py-1 rounded bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/40 font-mono text-xs animate-pulse">
            STEP {activeDemoStep} OF 9 ACTIVE
          </span>
        )}
      </div>

      {/* Horizontal Step Pipeline with responsiveness */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeDemoStep === s.id;
          const isPast = activeDemoStep && activeDemoStep > s.id;

          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center relative ${
                isActive
                  ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-glowCyan/30 scale-105 z-10'
                  : isPast
                  ? 'bg-surface-850 border-cyber-emerald/40 text-slate-300'
                  : 'bg-surface-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform ${
                  isActive
                    ? 'bg-cyber-cyan text-void font-bold shadow-md'
                    : isPast
                    ? 'bg-cyber-emerald/20 text-cyber-emerald'
                    : 'bg-surface-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-200 font-mono leading-tight">
                {s.title}
              </span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                {s.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
