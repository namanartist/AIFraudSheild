import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'rose' | 'emerald' | 'none';
  header?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  header
}) => {
  const glowClasses = {
    cyan: 'border-cyber-cyan/30 shadow-glowCyan/10',
    purple: 'border-cyber-purple/30 shadow-glowPurple/10',
    rose: 'border-cyber-rose/30 shadow-glowRose/10',
    emerald: 'border-cyber-emerald/30 shadow-glowEmerald/10',
    none: 'border-slate-800/80 hover:border-slate-700/80'
  };

  return (
    <div
      className={`glass-panel p-6 border transition-all duration-300 relative overflow-hidden ${glowClasses[glow]} ${className}`}
    >
      {header && <div className="mb-4 pb-3 border-b border-slate-800/80">{header}</div>}
      {children}
    </div>
  );
};
