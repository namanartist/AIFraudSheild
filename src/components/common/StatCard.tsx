import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  color = 'cyan',
  subtitle
}) => {
  const colorMap = {
    cyan: {
      border: 'border-cyber-cyan/20 hover:border-cyber-cyan/50',
      iconBg: 'bg-cyber-cyan/10 text-cyber-cyan',
      glow: 'shadow-glowCyan/20',
      valueColor: 'text-white'
    },
    purple: {
      border: 'border-cyber-purple/20 hover:border-cyber-purple/50',
      iconBg: 'bg-cyber-purple/10 text-cyber-purple',
      glow: 'shadow-glowPurple/20',
      valueColor: 'text-white'
    },
    emerald: {
      border: 'border-cyber-emerald/20 hover:border-cyber-emerald/50',
      iconBg: 'bg-cyber-emerald/10 text-cyber-emerald',
      glow: 'shadow-glowEmerald/20',
      valueColor: 'text-white'
    },
    rose: {
      border: 'border-cyber-rose/20 hover:border-cyber-rose/50',
      iconBg: 'bg-cyber-rose/10 text-cyber-rose',
      glow: 'shadow-glowRose/20',
      valueColor: 'text-white'
    },
    amber: {
      border: 'border-cyber-amber/20 hover:border-cyber-amber/50',
      iconBg: 'bg-cyber-amber/10 text-cyber-amber',
      glow: 'shadow-amber-500/20',
      valueColor: 'text-white'
    }
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`glass-panel p-5 border transition-all duration-300 relative overflow-hidden group hover:translate-y-[-2px] ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono tracking-wider text-slate-400 uppercase">{title}</p>
          <h3 className={`text-2xl font-bold font-mono mt-1 ${scheme.valueColor}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${scheme.iconBg} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
          {change && (
            <span
              className={`font-mono font-medium ${
                isPositive ? 'text-cyber-emerald' : 'text-cyber-rose'
              }`}
            >
              {isPositive ? '▲' : '▼'} {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400 text-[11px] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
