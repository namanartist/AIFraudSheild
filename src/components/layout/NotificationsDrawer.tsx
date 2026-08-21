import React from 'react';
import { useFraudShield } from '../../context/FraudShieldContext';
import { Bell, ShieldAlert, CheckCircle2, Info, AlertTriangle, X, ExternalLink } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications } = useFraudShield();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-cyber-rose" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-cyber-amber" />;
      default:
        return <Info className="w-4 h-4 text-cyber-cyan" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-sm h-full bg-surface-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl p-5 flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Security Alerts</h3>
              <p className="text-[11px] font-mono text-slate-400">Decentralized Threat Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No recent security alerts.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-surface-900/80 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-200 text-[12px]">{n.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
