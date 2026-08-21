import React, { useState } from 'react';
import { useFraudShield } from '../../context/FraudShieldContext';
import { RiskBadge } from '../common/RiskBadge';
import { formatAddress, formatTxHash } from '../../utils/blockchain';
import { Radio, Play, Pause, Filter, ShieldAlert, ExternalLink, ArrowRight } from 'lucide-react';

interface LiveMempoolStreamProps {
  onInspectTx?: (tx: any) => void;
  maxItems?: number;
}

export const LiveMempoolStream: React.FC<LiveMempoolStreamProps> = ({
  onInspectTx,
  maxItems = 15
}) => {
  const { mempool } = useFraudShield();
  const [isPaused, setIsPaused] = useState(false);
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'CRITICAL' | 'SUSPICIOUS' | 'CLEAN'>('ALL');

  const filteredMempool = mempool.filter((tx) => {
    if (filterRisk === 'CRITICAL') return tx.riskScore > 70;
    if (filterRisk === 'SUSPICIOUS') return tx.riskScore > 30 && tx.riskScore <= 70;
    if (filterRisk === 'CLEAN') return tx.riskScore <= 30;
    return true;
  });

  const displayList = filteredMempool.slice(0, maxItems);

  return (
    <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
      {/* Stream Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Radio className="w-5 h-5 text-cyber-rose animate-pulse" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyber-rose animate-ping" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Live Mempool Threat Telemetry
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Continuous Real-Time Anomaly Interception Stream
            </p>
          </div>
        </div>

        {/* Filter Pills & Pause Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-900 rounded-lg p-0.5 border border-slate-800 text-[10px] font-mono">
            {(['ALL', 'CRITICAL', 'SUSPICIOUS', 'CLEAN'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-2 py-1 rounded transition-all ${
                  filterRisk === lvl
                    ? 'bg-surface-850 text-cyber-cyan font-bold border border-cyber-cyan/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-surface-900 hover:bg-surface-850 border border-slate-800 text-slate-300 hover:text-white"
            title={isPaused ? 'Resume Stream' : 'Pause Stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-cyber-emerald" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Transaction Feed List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {displayList.length === 0 ? (
          <div className="text-center py-10 font-mono text-xs text-slate-500">
            No transactions match the selected risk filter.
          </div>
        ) : (
          displayList.map((tx, idx) => {
            const isHigh = tx.riskScore > 70;
            const isMed = tx.riskScore > 30 && tx.riskScore <= 70;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono group ${
                  isHigh
                    ? 'bg-cyber-rose/10 border-cyber-rose/30 hover:border-cyber-rose/60'
                    : isMed
                    ? 'bg-cyber-amber/5 border-cyber-amber/20 hover:border-cyber-amber/40'
                    : 'bg-surface-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <RiskBadge score={tx.riskScore} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <span className="font-bold">{formatAddress(tx.from, 3)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="font-bold text-slate-300">{formatAddress(tx.to, 3)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{tx.type}</span>
                      <span>•</span>
                      <span>Gas: {tx.gasGwei} Gwei</span>
                      <span>•</span>
                      <span className="text-slate-500">{tx.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="text-right">
                    <span className="font-bold text-slate-100">{tx.amount}</span>
                  </div>

                  {onInspectTx && (
                    <button
                      onClick={() => onInspectTx(tx)}
                      className="px-2.5 py-1 rounded bg-surface-850 hover:bg-surface-800 border border-slate-700 hover:border-cyber-cyan text-[11px] text-slate-300 hover:text-white transition-colors"
                    >
                      Analyze
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
