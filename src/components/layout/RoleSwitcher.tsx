import React, { useState } from 'react';
import { useWeb3, DEMO_PERSONAS } from '../../context/Web3Context';
import { UserRole } from '../../types';
import { Shield, UserCheck, Scale, Cpu, ChevronDown, Check } from 'lucide-react';
import { formatAddress } from '../../utils/blockchain';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole, activePersona } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'User':
        return <UserCheck className="w-4 h-4 text-cyber-cyan" />;
      case 'Investigator':
        return <Shield className="w-4 h-4 text-cyber-purple" />;
      case 'Validator':
        return <Scale className="w-4 h-4 text-cyber-amber" />;
      case 'Admin':
        return <Cpu className="w-4 h-4 text-cyber-rose" />;
      default:
        return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'User':
        return 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30';
      case 'Investigator':
        return 'bg-cyber-purple/15 text-cyber-purple border-cyber-purple/30';
      case 'Validator':
        return 'bg-cyber-amber/15 text-cyber-amber border-cyber-amber/30';
      case 'Admin':
        return 'bg-cyber-rose/15 text-cyber-rose border-cyber-rose/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-900 border border-slate-700/80 hover:border-cyber-cyan/40 transition-all text-xs font-mono group"
      >
        <div className="flex items-center gap-1.5">
          {getRoleIcon(currentRole)}
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getRoleBadge(currentRole)}`}>
            {currentRole.toUpperCase()}
          </span>
        </div>
        <span className="text-slate-300 hidden sm:inline">{formatAddress(activePersona.address, 3)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface-950/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Switch Demo Persona</span>
              <span className="text-[10px] text-cyber-cyan">4 Roles Available</span>
            </div>

            <div className="space-y-1 mt-1">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = p.role === currentRole;
                return (
                  <button
                    key={p.role}
                    onClick={() => {
                      switchRole(p.role);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-surface-850 border border-cyber-cyan/40 shadow-sm'
                        : 'hover:bg-surface-900 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{p.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyber-cyan" />}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.tagline}</p>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-slate-500">
                        <span>{formatAddress(p.address, 4)}</span>
                        <span>•</span>
                        <span className="text-cyber-cyan">{p.balance}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
