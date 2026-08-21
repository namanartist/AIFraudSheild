import React from 'react';
import { Play, ShieldCheck, AlertTriangle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { useFraudShield } from '../../context/FraudShieldContext';

export const DemoScenarioBanner: React.FC = () => {
  const { runDemoScenario, isAnalyzing, activeDemoStep } = useFraudShield();

  return (
    <div className="glass-panel p-4 border border-cyber-cyan/30 bg-gradient-to-r from-surface-950 via-surface-900 to-surface-950 rounded-xl relative overflow-hidden mb-6">
      {/* Background cyber accent */}
      <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-cyber-cyan/10 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyber-cyan" />
                Live Demo Scenarios
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                1-CLICK EVALUATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute complete real-time pipeline: AI Detection → IPFS Evidence → Smart Contract → DAO Consensus.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Scenario 1: Normal */}
          <button
            onClick={() => runDemoScenario('NORMAL')}
            disabled={isAnalyzing}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-lg bg-surface-850 hover:bg-surface-800 border border-cyber-emerald/30 hover:border-cyber-emerald text-xs font-mono text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-cyber-emerald group-hover:scale-110 transition-transform" />
            <span>Scenario 1: Normal (18/100)</span>
          </button>

          {/* Scenario 2: Suspicious */}
          <button
            onClick={() => runDemoScenario('SUSPICIOUS')}
            disabled={isAnalyzing}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-lg bg-surface-850 hover:bg-surface-800 border border-cyber-amber/30 hover:border-cyber-amber text-xs font-mono text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4 text-cyber-amber group-hover:scale-110 transition-transform" />
            <span>Scenario 2: Suspicious (67/100)</span>
          </button>

          {/* Scenario 3: Whale Fraud */}
          <button
            onClick={() => runDemoScenario('FRAUD')}
            disabled={isAnalyzing}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-lg bg-cyber-rose/20 hover:bg-cyber-rose/30 border border-cyber-rose/50 hover:border-cyber-rose text-xs font-mono text-cyber-rose hover:text-white font-bold flex items-center justify-center gap-2 transition-all shadow-glowRose/20 group disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4 text-cyber-rose group-hover:scale-110 transition-transform animate-bounce" />
            <span>Scenario 3: Drainer Attack (94/100)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
