import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { useFraudShield } from '../../context/FraudShieldContext';
import { RoleSwitcher } from './RoleSwitcher';
import { WalletModal } from './WalletModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import {
  Shield,
  Wallet,
  Bell,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { formatAddress } from '../../utils/blockchain';

interface NavbarProps {
  onOpenSidebar?: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar, currentPage, onNavigate }) => {
  const { address, balance, currentNetwork, isConnected } = useWeb3();
  const { notifications } = useFraudShield();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadAlerts = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-surface-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/40 shadow-glowCyan/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-cyber-cyan group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyber-emerald animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyber-cyan transition-colors">
                    AI FraudShield
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                  Decentralized Fraud Intelligence Network
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Shortcuts (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-surface-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-cyber-cyan/15 text-cyber-cyan font-bold border border-cyber-cyan/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('analyzer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'analyzer'
                  ? 'bg-cyber-cyan/15 text-cyber-cyan font-bold border border-cyber-cyan/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => onNavigate('investigation')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'investigation'
                  ? 'bg-cyber-purple/15 text-cyber-purple font-bold border border-cyber-purple/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Investigation
            </button>
            <button
              onClick={() => onNavigate('dao')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'dao'
                  ? 'bg-cyber-amber/15 text-cyber-amber font-bold border border-cyber-amber/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DAO Voting
            </button>
            <button
              onClick={() => onNavigate('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 'architecture'
                  ? 'bg-cyber-emerald/15 text-cyber-emerald font-bold border border-cyber-emerald/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture Flow
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Network Pill */}
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-900 border border-slate-800 text-xs font-mono text-slate-300 hover:border-slate-700"
            >
              <Globe className="w-3.5 h-3.5 text-cyber-purple" />
              <span className="text-[11px] font-medium">{currentNetwork.name}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-lg bg-surface-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Threat alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyber-rose text-[9px] font-bold font-mono text-white flex items-center justify-center animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Web3 Wallet Connect */}
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 hover:from-cyber-cyan/30 hover:to-cyber-purple/30 border border-cyber-cyan/40 text-xs font-mono font-bold text-white transition-all shadow-glowCyan/10 group"
            >
              <Wallet className="w-3.5 h-3.5 text-cyber-cyan group-hover:scale-110 transition-transform" />
              <span>{formatAddress(address, 3)}</span>
            </button>
          </div>
        </div>
      </header>

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
};
