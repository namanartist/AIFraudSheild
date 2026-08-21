import React, { useState } from 'react';
import {
  Monitor,
  Server,
  Cpu,
  Blocks,
  Database,
  Users,
  Scale,
  RefreshCw,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    {
      id: 'client',
      label: 'React / Vite Client',
      role: 'Web3 Frontend',
      description: 'Provides responsive cybersecurity dashboard, wallet connector, mempool visualizer, and investigator studio.',
      tech: 'React 18 + TailwindCSS + Ethers.js',
      icon: Monitor,
      color: 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10'
    },
    {
      id: 'gateway',
      label: 'Node.js API Gateway',
      role: 'Backend Orchestrator',
      description: 'Manages REST endpoints, live WebSocket mempool streams, and coordinates IPFS & AI inference.',
      tech: 'Express.js + WebSocket + CORS',
      icon: Server,
      color: 'border-cyber-purple text-cyber-purple bg-cyber-purple/10'
    },
    {
      id: 'ai',
      label: 'AI Risk Engine',
      role: 'Behavioral & Anomaly ML',
      description: 'Isolation Forest anomaly scoring + XGBoost classification, generating 0-100 risk scores & SHAP explainability.',
      tech: 'Python FastAPI / Scikit-learn / XGBoost',
      icon: Cpu,
      color: 'border-cyber-rose text-cyber-rose bg-cyber-rose/10'
    },
    {
      id: 'ipfs',
      label: 'IPFS Evidence Vault',
      role: 'Decentralized Proof Storage',
      description: 'Generates immutable cryptographic CIDs (SHA-256 multihash) for screenshots, bytecode traces, and investigator reports.',
      tech: 'IPFS / Pinata Gateway / CIDv1',
      icon: Database,
      color: 'border-cyber-teal text-cyber-teal bg-cyber-teal/10'
    },
    {
      id: 'contracts',
      label: 'Smart Contracts (EVM)',
      role: 'On-Chain State & Rules',
      description: 'FraudRegistry.sol, ReputationContract.sol, FraudShieldDAO.sol managing immutable report registry & trust scores.',
      tech: 'Solidity 0.8.20 + Polygon Amoy / Sepolia',
      icon: Blocks,
      color: 'border-cyber-amber text-cyber-amber bg-cyber-amber/10'
    },
    {
      id: 'dao',
      label: 'DAO Validator Quorum',
      role: 'Decentralized Consensus',
      description: 'Staked validators inspect IPFS evidence, cast consensus votes, and reach quorum to finalize fraud reports.',
      tech: 'FraudShieldDAO.sol Quorum Voting',
      icon: Scale,
      color: 'border-cyber-emerald text-cyber-emerald bg-cyber-emerald/10'
    },
    {
      id: 'feedback',
      label: 'AI Retraining Loop',
      role: 'Continuous Learning',
      description: 'Ingests verified DAO ground-truth records to refine feature weightings and retrain AI models.',
      tech: 'Decentralized Active Learning Pipeline',
      icon: RefreshCw,
      color: 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Visual Canvas */}
      <div className="glass-panel p-6 border border-slate-800 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-cyan" />
              Technical Architecture & Data Flow
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Click any component to inspect its role, communication protocols, and cryptographic guarantees.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
            INTERACTIVE SYSTEM DIAGRAM
          </span>
        </div>

        {/* Node Grid Layout with Flow Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Column 1: Client & Gateway */}
          <div className="space-y-6 flex flex-col justify-center">
            {nodes.slice(0, 2).map((n) => {
              const Icon = n.icon;
              const isSelected = activeNode === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveNode(n.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${n.color} shadow-lg scale-102`
                      : 'bg-surface-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${n.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{n.label}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{n.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: AI & IPFS */}
          <div className="space-y-6 flex flex-col justify-center">
            {nodes.slice(2, 4).map((n) => {
              const Icon = n.icon;
              const isSelected = activeNode === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveNode(n.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${n.color} shadow-lg scale-102`
                      : 'bg-surface-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${n.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{n.label}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{n.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 3: Blockchain, DAO & Feedback */}
          <div className="space-y-4 flex flex-col justify-center">
            {nodes.slice(4).map((n) => {
              const Icon = n.icon;
              const isSelected = activeNode === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveNode(n.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${n.color} shadow-lg scale-102`
                      : 'bg-surface-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${n.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{n.label}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{n.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspector Drawer */}
        {activeNode && (
          <div className="mt-6 p-4 rounded-xl bg-surface-950 border border-cyber-cyan/40 animate-in fade-in duration-200">
            {(() => {
              const n = nodes.find((item) => item.id === activeNode)!;
              const Icon = n.icon;
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyber-cyan" />
                      <h4 className="text-sm font-bold text-white font-mono">{n.label}</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-850 text-slate-300 border border-slate-700">
                      {n.tech}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{n.description}</p>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
