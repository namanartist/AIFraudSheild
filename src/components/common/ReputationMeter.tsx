import React from 'react';
import { ShieldCheck, ShieldAlert, Award } from 'lucide-react';

interface ReputationMeterProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ReputationMeter: React.FC<ReputationMeterProps> = ({
  score,
  size = 'md',
  showLabel = true
}) => {
  const isHigh = score >= 75;
  const isMedium = score >= 40 && score < 75;
  const isLow = score < 40;

  const colorClass = isHigh
    ? 'text-cyber-emerald from-cyber-emerald to-cyber-teal'
    : isMedium
    ? 'text-cyber-amber from-cyber-amber to-orange-500'
    : 'text-cyber-rose from-cyber-rose to-red-600';

  const statusText = isHigh ? 'TRUSTED WALLET' : isMedium ? 'MODERATE RISK' : 'HIGH RISK / BLACKLISTED';

  return (
    <div className="flex flex-col gap-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            {isHigh ? (
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
            ) : isLow ? (
              <ShieldAlert className="w-3.5 h-3.5 text-cyber-rose" />
            ) : (
              <Award className="w-3.5 h-3.5 text-cyber-amber" />
            )}
            REPUTATION STATUS
          </span>
          <span className={`font-bold ${isHigh ? 'text-cyber-emerald' : isMedium ? 'text-cyber-amber' : 'text-cyber-rose'}`}>
            {statusText} ({score}/100)
          </span>
        </div>
      )}

      {/* Bar meter */}
      <div className="w-full bg-slate-900/90 rounded-full h-2.5 p-0.5 border border-slate-700/50 overflow-hidden relative">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 shadow-sm`}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>
    </div>
  );
};
