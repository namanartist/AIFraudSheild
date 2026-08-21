import React from 'react';
import { RiskFactor } from '../../types';
import { ShieldAlert, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface ExplainableFactorsProps {
  factors: RiskFactor[];
  explanation: string;
  recommendation: string;
}

export const ExplainableFactors: React.FC<ExplainableFactorsProps> = ({
  factors,
  explanation,
  recommendation
}) => {
  return (
    <div className="space-y-4">
      {/* Plain Language AI Thesis */}
      <div className="p-4 rounded-xl bg-surface-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-slate-300 font-bold uppercase tracking-wider text-[11px]">
          <Info className="w-3.5 h-3.5 text-cyber-cyan" />
          AI Diagnostic Thesis
        </div>
        <p className="text-slate-300 leading-relaxed font-sans text-sm">
          {explanation}
        </p>

        <div className="mt-3 pt-3 border-t border-slate-800 flex items-start gap-2">
          <span className="font-mono font-bold text-cyber-amber text-[11px] uppercase tracking-wider shrink-0 mt-0.5">
            Recommendation:
          </span>
          <p className="text-xs font-mono text-slate-200 font-semibold">
            {recommendation}
          </p>
        </div>
      </div>

      {/* SHAP-Style Factor Breakdown */}
      <div>
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Top Explainable Risk Factors</span>
          <span className="text-[10px] text-slate-500">Feature Attribution (SHAP)</span>
        </h4>

        <div className="space-y-2">
          {factors.map((factor, idx) => {
            const isCritical = factor.impact === 'CRITICAL';
            const isHigh = factor.impact === 'HIGH';
            const isPositive = !factor.isNegative;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-cyber-rose/10 border-cyber-rose/40'
                    : isHigh
                    ? 'bg-surface-900 border-cyber-amber/30'
                    : isPositive
                    ? 'bg-cyber-emerald/5 border-cyber-emerald/20'
                    : 'bg-surface-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCritical ? (
                      <ShieldAlert className="w-4 h-4 text-cyber-rose" />
                    ) : isHigh ? (
                      <AlertTriangle className="w-4 h-4 text-cyber-amber" />
                    ) : isPositive ? (
                      <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
                    ) : (
                      <Info className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="font-mono text-xs font-bold text-white">
                      {factor.name}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      isPositive
                        ? 'bg-cyber-emerald/15 text-cyber-emerald'
                        : isCritical
                        ? 'bg-cyber-rose/20 text-cyber-rose'
                        : 'bg-cyber-amber/15 text-cyber-amber'
                    }`}
                  >
                    {factor.weight}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1 pl-6 leading-relaxed">
                  {factor.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
