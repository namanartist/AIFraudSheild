import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  ShieldAlert,
  Search,
  Scale,
  Radio,
  FileCode,
  Network,
  Activity,
  Layers,
  Settings,
  Database,
  Users,
  ShieldCheck,
  Flame,
  Key,
  AlertOctagon,
  ExternalLink
} from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { currentRole } = useWeb3();

  const navigationGroups = [
    {
      group: 'Core Intelligence',
      items: [
        { id: 'dashboard', label: 'Mission Dashboard', icon: LayoutDashboard },
        { id: 'analyzer', label: 'Transaction Analyzer', icon: Cpu, badge: 'AI ML' },
        { id: 'live', label: 'Live Mempool Stream', icon: Radio, badge: 'LIVE' },
        { id: 'reputation', label: 'Wallet Reputation', icon: Search },
      ]
    },
    {
      group: 'Security & Threat Defense',
      items: [
        { id: 'scanner', label: 'Contract Scanner', icon: FileCode, badge: 'AUDIT' },
        { id: 'honeypot', label: 'Honeypot Detector', icon: Flame, badge: 'SIM' },
        { id: 'allowance', label: 'Allowance Guardian', icon: Key, badge: 'REVOKE' },
        { id: 'threats', label: 'Global Threat Radar', icon: AlertOctagon, badge: 'SIEM' },
      ]
    },
    {
      group: 'Forensics & Governance',
      items: [
        {
          id: 'investigation',
          label: 'Fraud Investigation',
          icon: ShieldAlert,
          roleRequired: 'Investigator'
        },
        {
          id: 'dao',
          label: 'DAO Verification',
          icon: Scale,
          roleRequired: 'Validator',
          badge: 'Quorum'
        },
        { id: 'ipfs', label: 'IPFS Evidence Vault', icon: Database },
        { id: 'validators', label: 'Validator Staking', icon: Users, roleRequired: 'Validator' }
      ]
    },
    {
      group: 'AI Engine & Architecture',
      items: [
        { id: 'analytics', label: 'AI Analytics & Retrain', icon: Activity, badge: 'Feedback' },
        { id: 'architecture', label: 'Interactive Architecture', icon: Network },
        { id: 'admin', label: 'Admin Command', icon: Layers, roleRequired: 'Admin' },
        { id: 'settings', label: 'Smart Contracts & RPC', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-surface-950/70 backdrop-blur-md border-r border-slate-800/80 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        {navigationGroups.map((grp) => (
          <div key={grp.group} className="space-y-1.5">
            <h5 className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {grp.group}
            </h5>
            <div className="space-y-0.5">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const isRoleMatch = !item.roleRequired || item.roleRequired === currentRole;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all group ${
                      isActive
                        ? 'bg-cyber-cyan/15 text-cyber-cyan font-bold border border-cyber-cyan/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-surface-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-cyber-cyan' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.badge === 'LIVE'
                            ? 'bg-cyber-rose/20 text-cyber-rose animate-pulse'
                            : item.badge === 'AI ML'
                            ? 'bg-cyber-purple/20 text-cyber-purple'
                            : 'bg-cyber-amber/20 text-cyber-amber'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Network Status Card in Bottom Sidebar */}
      <div className="p-3 rounded-xl bg-surface-900/60 border border-slate-800 text-[11px] font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
            AI Pipeline Active
          </span>
          <span className="text-[10px] text-cyber-cyan">96.4% Acc</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Smart Contract Quorum</span>
          <span className="text-slate-200 font-bold">3/3</span>
        </div>
      </div>
    </aside>
  );
};
