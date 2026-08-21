import React from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Users,
  Database,
  TrendingUp,
  ArrowRight,
  Radio,
  ExternalLink,
  FileCode,
  Flame,
  Key,
  AlertOctagon,
  Shield
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { DemoScenarioBanner } from '../components/common/DemoScenarioBanner';
import { LiveMempoolStream } from '../components/live/LiveMempoolStream';
import { RiskBadge } from '../components/common/RiskBadge';
import { useFraudShield } from '../context/FraudShieldContext';
import { formatAddress } from '../utils/blockchain';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onInspectTx: (tx: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onInspectTx }) => {
  const { reports, wallets, feedbackMetrics } = useFraudShield();

  // Mock trend data
  const trendData = [
    { time: '00:00', threats: 12, analyzed: 2400 },
    { time: '04:00', threats: 19, analyzed: 3100 },
    { time: '08:00', threats: 45, analyzed: 5800 },
    { time: '12:00', threats: 82, analyzed: 9200 },
    { time: '16:00', threats: 54, analyzed: 7800 },
    { time: '20:00', threats: 68, analyzed: 8900 },
    { time: 'Now', threats: 76, analyzed: 9450 },
  ];

  // Risk distribution data
  const riskDistribution = [
    { name: 'Low Risk (0-30)', value: 78, color: '#10b981' },
    { name: 'Medium Risk (31-70)', value: 16, color: '#f59e0b' },
    { name: 'High Risk (71-100)', value: 6, color: '#f43f5e' },
  ];

  const highRiskWallets = Object.values(wallets)
    .filter(w => w.reputationScore < 50 || w.riskLevel === 'HIGH')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1-Click Demo Scenarios */}
      <DemoScenarioBanner />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-cyan" />
            Security Intelligence Mission Control
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Real-time decentralized fraud telemetry, AI risk analysis, and validator quorum status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('threats')}
            className="px-3.5 py-2 rounded-xl bg-cyber-rose/15 hover:bg-cyber-rose/25 border border-cyber-rose/40 text-cyber-rose text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glowRose/10"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Threat Radar (DEFCON 2)</span>
          </button>
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-3.5 py-2 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glowCyan/10"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch Analyzer</span>
          </button>
        </div>
      </div>

      {/* Web3 Security Suite Hub */}
      <div className="p-4 rounded-2xl bg-surface-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Web3 Security & Threat Defense Suite
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyber-cyan">Full-Stack Security Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Scanner */}
          <button
            onClick={() => onNavigate('scanner')}
            className="p-3.5 rounded-xl bg-surface-900/90 border border-slate-800 hover:border-cyber-cyan/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <FileCode className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                AUDIT
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200">Smart Contract Scanner</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Static AST auditor with remediation diffs
            </div>
          </button>

          {/* Honeypot */}
          <button
            onClick={() => onNavigate('honeypot')}
            className="p-3.5 rounded-xl bg-surface-900/90 border border-slate-800 hover:border-cyber-purple/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-cyber-purple group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30">
                SIMULATE
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200">Honeypot Detector</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              DEX swap simulation & anti-dump detector
            </div>
          </button>

          {/* Allowance */}
          <button
            onClick={() => onNavigate('allowance')}
            className="p-3.5 rounded-xl bg-surface-900/90 border border-slate-800 hover:border-cyber-emerald/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Key className="w-5 h-5 text-cyber-emerald group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30">
                REVOKE
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200">Allowance Guardian</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Scan unlimited token approvals & drainers
            </div>
          </button>

          {/* Threat Radar */}
          <button
            onClick={() => onNavigate('threats')}
            className="p-3.5 rounded-xl bg-surface-900/90 border border-slate-800 hover:border-cyber-rose/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertOctagon className="w-5 h-5 text-cyber-rose group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyber-rose/15 text-cyber-rose border border-cyber-rose/30">
                DEFCON 2
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200">Global Threat Radar</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Live Web3 SIEM attack telemetry stream
            </div>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Analyzed"
          value="142,980"
          change="+14.2%"
          isPositive={true}
          icon={Activity}
          color="cyan"
          subtitle="All connected testnets"
        />
        <StatCard
          title="Suspicious Cases"
          value="423"
          change="+8.1%"
          isPositive={false}
          icon={ShieldAlert}
          color="rose"
          subtitle="Flagged by AI engine"
        />
        <StatCard
          title="Verified Fraud"
          value="89"
          change="DAO Confirmed"
          isPositive={true}
          icon={ShieldCheck}
          color="amber"
          subtitle="On-Chain Registry"
        />
        <StatCard
          title="Protected Wallets"
          value="12,450"
          change="+320 new"
          isPositive={true}
          icon={Users}
          color="emerald"
          subtitle="Active Shield users"
        />
        <StatCard
          title="Average Risk"
          value="28.4"
          change="Baseline Normal"
          isPositive={true}
          icon={Cpu}
          color="purple"
          subtitle="0-100 Network index"
        />
        <StatCard
          title="AI Accuracy"
          value={`${feedbackMetrics.accuracy}%`}
          change={`F1: ${feedbackMetrics.f1Score}`}
          isPositive={true}
          icon={TrendingUp}
          color="cyan"
          subtitle="Ensemble v2.4"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud Threat Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Threat Volume & Analyzed Mempool Flow
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Hourly transaction volume vs AI intercepted anomalous bursts
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-850 text-slate-300 border border-slate-700">
              LAST 24 HOURS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAnalyzed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c142b',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px'
                  }}
                />
                <Area type="monotone" dataKey="analyzed" stroke="#00f0ff" fillOpacity={1} fill="url(#colorAnalyzed)" />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-800">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Network Risk Distribution
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Categorized transaction risk tiers
            </p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c142b',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold font-mono text-white">78%</span>
              <span className="text-[9px] font-mono text-slate-400">Low Risk</span>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs pt-2 border-t border-slate-800/80">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Grid: Live Stream & Threat Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveMempoolStream onInspectTx={onInspectTx} />
        </div>

        {/* Flagged / High Risk Wallets Leaderboard */}
        <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyber-rose" />
                High-Risk Wallet Watchlist
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Decentralized blacklist & drainer entities
              </p>
            </div>
            <button
              onClick={() => onNavigate('reputation')}
              className="text-[11px] font-mono text-cyber-cyan hover:underline"
            >
              Explore All
            </button>
          </div>

          <div className="space-y-2.5">
            {highRiskWallets.map((w) => (
              <div
                key={w.address}
                onClick={() => onNavigate('reputation')}
                className="p-3 rounded-xl bg-surface-900/80 border border-slate-800 hover:border-cyber-rose/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-cyber-rose transition-colors">
                    {formatAddress(w.address, 4)}
                  </span>
                  <RiskBadge score={100 - w.reputationScore} category="HIGH" size="sm" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">{w.label}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                  <span>Reputation: <strong className="text-cyber-rose">{w.reputationScore}/100</strong></span>
                  <span>{w.verifiedFraudReports} Verified Flags</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
