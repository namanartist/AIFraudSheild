import React from 'react';
import { LiveMempoolStream } from '../components/live/LiveMempoolStream';
import { Radio, ShieldAlert, Zap, Globe, Activity } from 'lucide-react';
import { useFraudShield } from '../context/FraudShieldContext';

interface LiveMonitoringProps {
  onInspectTx: (tx: any) => void;
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({ onInspectTx }) => {
  const { mempool } = useFraudShield();

  const criticalCount = mempool.filter(t => t.riskScore > 70).length;
  const suspiciousCount = mempool.filter(t => t.riskScore > 30 && t.riskScore <= 70).length;
  const cleanCount = mempool.filter(t => t.riskScore <= 30).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyber-rose animate-pulse" />
            Live Mempool Stream & Threat Interceptor
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Decentralized node RPC feed with automated real-time AI behavioral feature extraction.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
            WebSocket Live (400ms tick)
          </span>
        </div>
      </div>

      {/* Ticker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 border border-cyber-rose/30 bg-cyber-rose/5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Critical Intercepts (Risk &gt; 70)</span>
          <p className="text-2xl font-bold font-mono text-cyber-rose mt-1">{criticalCount} Active</p>
        </div>
        <div className="glass-panel p-4 border border-cyber-amber/30 bg-cyber-amber/5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Suspicious Flagged (Risk 31-70)</span>
          <p className="text-2xl font-bold font-mono text-cyber-amber mt-1">{suspiciousCount} Active</p>
        </div>
        <div className="glass-panel p-4 border border-cyber-emerald/30 bg-cyber-emerald/5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Clean Transactions (Risk &le; 30)</span>
          <p className="text-2xl font-bold font-mono text-cyber-emerald mt-1">{cleanCount} Active</p>
        </div>
      </div>

      <LiveMempoolStream onInspectTx={onInspectTx} maxItems={40} />
    </div>
  );
};
