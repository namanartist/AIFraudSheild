import React from 'react';
import { RiskBadge } from '../common/RiskBadge';

interface RiskGaugeProps {
  score: number; // 0 - 100
  confidenceScore?: number;
  category: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  confidenceScore = 0.95,
  category
}) => {
  // SVG gauge calculations
  const radius = 80;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Semi-circle offset (180 deg)
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  const getScoreColor = () => {
    if (score > 70) return '#f43f5e'; // rose
    if (score > 30) return '#f59e0b'; // amber
    return '#10b981'; // emerald
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Radar pulsing ring in background */}
        {score > 70 && (
          <div className="absolute inset-0 rounded-full border border-cyber-rose/20 animate-radar pointer-events-none" />
        )}

        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="rgba(30, 41, 59, 0.6)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            r={normalizedRadius}
            cx="96"
            cy="96"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            stroke={getScoreColor()}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx="96"
            cy="96"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${getScoreColor()}66)`
            }}
          />
        </svg>

        {/* Center Score Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            / 100 Risk
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-1.5">
        <RiskBadge score={score} category={category} size="lg" />
        <span className="text-[11px] font-mono text-slate-400">
          AI Model Confidence: <strong className="text-white">{(confidenceScore * 100).toFixed(1)}%</strong>
        </span>
      </div>
    </div>
  );
};
