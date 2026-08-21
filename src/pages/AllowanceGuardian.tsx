import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Zap,
  Check,
  Shield,
  HelpCircle,
  Key
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { MOCK_WALLET_ALLOWANCES } from '../../server/securityEngine.js';

export const AllowanceGuardian: React.FC = () => {
  const { address } = useWeb3();
  const [inspectedAddress, setInspectedAddress] = useState<string>('');
  const [allowances, setAllowances] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isBatchRevoking, setIsBatchRevoking] = useState<boolean>(false);
  const [revokedIds, setRevokedIds] = useState<string[]>([]);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    const active = address || '0x3A289bFE26A18d9633e79e65839C726f16E491eE';
    setInspectedAddress(active);
    loadAllowances();
  }, [address]);

  const loadAllowances = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAllowances([...MOCK_WALLET_ALLOWANCES['default']]);
      setIsScanning(false);
    }, 350);
  };

  const handleRevokeSingle = (id: string, tokenSymbol: string, spenderName: string) => {
    setRevokingId(id);
    setTimeout(() => {
      setAllowances((prev) => prev.filter((a) => a.id !== id));
      setRevokedIds((prev) => [...prev, id]);
      setRevokingId(null);
      setFeedbackToast(`Successfully revoked approval for ${tokenSymbol} to ${spenderName}.`);
      setTimeout(() => setFeedbackToast(null), 4000);
    }, 700);
  };

  const handleBatchRevokeHighRisk = () => {
    setIsBatchRevoking(true);
    setTimeout(() => {
      const highRisk = allowances.filter((a) => a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH');
      setRevokedIds((prev) => [...prev, ...highRisk.map((a) => a.id)]);
      setAllowances((prev) => prev.filter((a) => a.riskLevel !== 'CRITICAL' && a.riskLevel !== 'HIGH'));
      setIsBatchRevoking(false);
      setFeedbackToast(`Emergency batch revoke executed: ${highRisk.length} hazardous permissions revoked!`);
      setTimeout(() => setFeedbackToast(null), 4000);
    }, 1000);
  };

  const criticalCount = allowances.filter((a) => a.riskLevel === 'CRITICAL').length;
  const highCount = allowances.filter((a) => a.riskLevel === 'HIGH').length;
  const safeCount = allowances.filter((a) => a.riskLevel === 'SAFE' || a.riskLevel === 'LOW').length;

  const walletHealthScore = Math.max(
    10,
    100 - criticalCount * 40 - highCount * 25
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-surface-900 border border-cyber-emerald text-cyber-emerald shadow-2xl flex items-center gap-3 animate-slideUp font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-900 via-surface-950 to-surface-900 border border-slate-800 p-6 md:p-8">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
              <Key className="w-3.5 h-3.5" />
              <span>ERC20 & ERC721 Token Allowance Guardian</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Wallet Allowance & Permission Guardian
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Audit all active smart contract approvals, detect dangerous unlimited allowances (`type(uint256).max`), and 1-click revoke permissions granted to phishing drainers.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface-950/80 border border-slate-800 p-4 rounded-xl shrink-0">
            <div className="text-center">
              <div className="text-xs font-mono text-slate-400">Approval Health</div>
              <div
                className={`text-3xl font-extrabold font-mono ${
                  walletHealthScore >= 80
                    ? 'text-cyber-emerald'
                    : walletHealthScore >= 50
                    ? 'text-cyber-amber'
                    : 'text-cyber-rose'
                }`}
              >
                {walletHealthScore}%
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-xs font-mono text-slate-400">At-Risk Approvals</div>
              <div
                className={`text-2xl font-bold font-mono ${
                  criticalCount + highCount > 0 ? 'text-cyber-rose' : 'text-cyber-emerald'
                }`}
              >
                {criticalCount + highCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Bar & Emergency Batch Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-surface-950 border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-400">Target Wallet:</span>
          <span className="text-xs font-mono text-cyber-cyan bg-surface-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {inspectedAddress}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadAllowances}
            disabled={isScanning}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-900 hover:bg-surface-800 border border-slate-800 text-xs font-mono text-slate-300 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Rescan</span>
          </button>

          {criticalCount + highCount > 0 && (
            <button
              onClick={handleBatchRevokeHighRisk}
              disabled={isBatchRevoking}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-rose to-rose-600 hover:opacity-90 text-white text-xs font-mono font-bold transition-all shadow-glowRose/20 disabled:opacity-50"
            >
              {isBatchRevoking ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Batch Revoking...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke All High Risks ({criticalCount + highCount})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Allowances Table / Cards */}
      <div className="space-y-3">
        {allowances.length === 0 ? (
          <div className="p-12 rounded-2xl bg-surface-950 border border-cyber-emerald/30 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-cyber-emerald mx-auto" />
            <h3 className="text-base font-bold text-white font-mono">
              Zero Risky Approvals Found!
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your wallet has no outstanding hazardous or drainer token allowances. Your asset authorizations are completely clean.
            </p>
          </div>
        ) : (
          allowances.map((item) => {
            const isCritical = item.riskLevel === 'CRITICAL';
            const isHigh = item.riskLevel === 'HIGH';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-surface-950 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCritical
                    ? 'border-cyber-rose/50 bg-cyber-rose/5'
                    : isHigh
                    ? 'border-cyber-amber/50 bg-cyber-amber/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isCritical
                        ? 'bg-cyber-rose/20 text-cyber-rose border-cyber-rose/40 animate-pulse'
                        : isHigh
                        ? 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/40'
                        : 'bg-surface-900 text-cyber-cyan border-slate-800'
                    }`}
                  >
                    {isCritical || isHigh ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-cyber-emerald" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">
                        {item.tokenName} ({item.tokenSymbol})
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'bg-cyber-rose/20 text-cyber-rose border-cyber-rose/40'
                            : isHigh
                            ? 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/40'
                            : 'bg-cyber-emerald/20 text-cyber-emerald border-cyber-emerald/40'
                        }`}
                      >
                        {item.riskLevel} RISK
                      </span>
                      {item.isUnlimited && (
                        <span className="text-[9px] font-mono bg-surface-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                          Unlimited ∞
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2">
                      <span>Approved Spender:</span>
                      <span className="text-slate-200 font-bold">{item.spenderName}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.spenderAddress.substring(0, 10)}...{item.spenderAddress.slice(-6)}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      Allowance: <span className="text-slate-300 font-bold">{item.allowanceAmount}</span> • Last granted {item.lastApproved}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() =>
                      handleRevokeSingle(item.id, item.tokenSymbol, item.spenderName)
                    }
                    disabled={revokingId === item.id}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                      isCritical || isHigh
                        ? 'bg-cyber-rose/20 hover:bg-cyber-rose text-cyber-rose hover:text-white border border-cyber-rose/40'
                        : 'bg-surface-900 hover:bg-surface-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {revokingId === item.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Revoking...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
