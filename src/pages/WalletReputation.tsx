import React, { useState } from 'react';
import { useFraudShield } from '../context/FraudShieldContext';
import { useWeb3 } from '../context/Web3Context';
import { ReputationMeter } from '../components/common/ReputationMeter';
import { RiskBadge } from '../components/common/RiskBadge';
import { FeatureRadar } from '../components/ai/FeatureRadar';
import {
  Search,
  Award,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Calendar,
  Layers,
  Database,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { formatAddress, getExplorerAddressUrl } from '../utils/blockchain';

export const WalletReputation: React.FC = () => {
  const { getWalletProfile, reports } = useFraudShield();
  const { address: currentAddress, currentNetwork } = useWeb3();

  const [searchQuery, setSearchQuery] = useState(currentAddress);
  const [activeAddress, setActiveAddress] = useState(currentAddress);
  const [copied, setCopied] = useState(false);

  const profile = getWalletProfile(activeAddress);
  const walletReports = reports.filter(
    (r) => r.targetWallet.toLowerCase() === activeAddress.toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveAddress(searchQuery.trim());
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Award className="w-5 h-5 text-cyber-emerald" />
            Decentralized Wallet Reputation Matrix
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Immutable trust ratings calculated from on-chain behavioral history and DAO verified verdicts.
          </p>
        </div>
      </div>

      {/* Address Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address (e.g., 0x71C8..., 0xd8d4...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 border border-slate-700 hover:border-cyber-cyan text-white text-xs font-mono font-bold transition-all"
        >
          Lookup
        </button>
      </form>

      {/* Quick Lookup Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-400 text-[11px]">Quick Presets:</span>
        <button
          onClick={() => {
            setSearchQuery('0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B');
            setActiveAddress('0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B');
          }}
          className="px-2.5 py-1 rounded bg-surface-900 hover:bg-surface-850 border border-cyber-emerald/30 text-cyber-emerald text-[11px]"
        >
          Alice (Trusted: 92)
        </button>
        <button
          onClick={() => {
            setSearchQuery('0xd8d4F3879a978680d28765275e7A837f48e30000');
            setActiveAddress('0xd8d4F3879a978680d28765275e7A837f48e30000');
          }}
          className="px-2.5 py-1 rounded bg-surface-900 hover:bg-surface-850 border border-cyber-rose/30 text-cyber-rose text-[11px]"
        >
          Drainer Sybil (Flagged: 12)
        </button>
        <button
          onClick={() => {
            setSearchQuery('0x3A289bFE26A18d9633e79e65839C726f16E491eE');
            setActiveAddress('0x3A289bFE26A18d9633e79e65839C726f16E491eE');
          }}
          className="px-2.5 py-1 rounded bg-surface-900 hover:bg-surface-850 border border-cyber-purple/30 text-cyber-purple text-[11px]"
        >
          Investigator (Lead: 98)
        </button>
      </div>

      {/* Main Profile Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profile Summary Card */}
        <div className="lg:col-span-5 glass-panel p-6 border border-slate-800 rounded-xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{profile.label}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-850 text-slate-300 border border-slate-700">
                  {profile.role}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
                <span className="truncate max-w-[200px] sm:max-w-xs">{profile.address}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <RiskBadge
              score={100 - profile.reputationScore}
              category={profile.riskLevel as any}
              size="md"
            />
          </div>

          {/* Visual Reputation Gauge */}
          <div className="p-4 rounded-xl bg-surface-900/90 border border-slate-800 space-y-2">
            <ReputationMeter score={profile.reputationScore} size="lg" />
          </div>

          {/* Key Activity Metrics */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-surface-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Analyzed Transactions</span>
              <p className="text-lg font-bold text-white mt-0.5">{profile.totalAnalyzedTx}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Wallet Longevity</span>
              <p className="text-lg font-bold text-white mt-0.5">{profile.walletAgeDays} Days</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Verified Fraud Cases</span>
              <p className={`text-lg font-bold mt-0.5 ${profile.verifiedFraudReports > 0 ? 'text-cyber-rose' : 'text-cyber-emerald'}`}>
                {profile.verifiedFraudReports}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">False Reports</span>
              <p className="text-lg font-bold text-slate-300 mt-0.5">{profile.falseReports}</p>
            </div>
          </div>

          {/* Explorer Link */}
          <a
            href={getExplorerAddressUrl(profile.address, currentNetwork.id)}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-surface-850 hover:bg-surface-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View on Blockchain Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right: Behavioral Analysis & Incident Log */}
        <div className="lg:col-span-7 space-y-6">
          {/* Behavioral Fingerprint Radar */}
          <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>BEHAVIORAL FINGERPRINT RADAR</span>
              <span className="text-cyber-cyan font-bold">Historical Profile Baseline</span>
            </div>
            <FeatureRadar
              metrics={profile.behavioralMetrics}
              currentAmount={profile.behavioralMetrics.avgAmountEth}
              currentRiskScore={100 - profile.reputationScore}
            />
          </div>

          {/* Verified Fraud Incident History */}
          <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                On-Chain Fraud & Incident Registry
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {walletReports.length} Reports Found
              </span>
            </div>

            {walletReports.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-cyber-emerald mx-auto mb-2" />
                No verified fraud cases or ongoing disputes on record for this address.
              </div>
            ) : (
              <div className="space-y-2.5">
                {walletReports.map((r) => (
                  <div
                    key={r.reportId}
                    className="p-3.5 rounded-xl bg-surface-900 border border-slate-800 space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyber-rose">CASE #{r.reportId}</span>
                        <span className="text-slate-300 font-sans font-bold">{r.evidenceTitle}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'Verified' ? 'bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/40' : 'bg-cyber-amber/20 text-cyber-amber'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 font-sans text-xs">{r.aiDiagnosisSummary}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>IPFS CID: <strong className="text-cyber-cyan">{r.ipfsEvidenceCID.substring(0, 12)}...</strong></span>
                      <span>Votes: {r.yesVotes} YES / {r.noVotes} NO</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
