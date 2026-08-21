import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

interface RiskBadgeProps {
  score?: number;
  category?: 'LOW' | 'MEDIUM' | 'HIGH' | 'TRUSTED';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  category,
  size = 'md',
  showIcon = true
}) => {
  let cat = category;
  if (!cat && score !== undefined) {
    if (score <= 30) cat = 'LOW';
    else if (score <= 70) cat = 'MEDIUM';
    else cat = 'HIGH';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2 font-semibold'
  };

  if (cat === 'HIGH') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-cyber-rose/15 text-cyber-rose border border-cyber-rose/40 font-mono tracking-wide ${sizeClasses[size]}`}
      >
        {showIcon && <ShieldAlert className="w-3.5 h-3.5" />}
        <span>HIGH RISK {score !== undefined ? `(${score})` : ''}</span>
      </span>
    );
  }

  if (cat === 'MEDIUM') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-cyber-amber/15 text-cyber-amber border border-cyber-amber/40 font-mono tracking-wide ${sizeClasses[size]}`}
      >
        {showIcon && <AlertTriangle className="w-3.5 h-3.5" />}
        <span>MEDIUM RISK {score !== undefined ? `(${score})` : ''}</span>
      </span>
    );
  }

  if (cat === 'TRUSTED') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 font-mono tracking-wide ${sizeClasses[size]}`}
      >
        {showIcon && <Sparkles className="w-3.5 h-3.5" />}
        <span>TRUSTED (100)</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/40 font-mono tracking-wide ${sizeClasses[size]}`}
    >
      {showIcon && <ShieldCheck className="w-3.5 h-3.5" />}
      <span>LOW RISK {score !== undefined ? `(${score})` : ''}</span>
    </span>
  );
};
