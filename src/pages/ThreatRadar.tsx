import React, { useState, useEffect } from 'react';
import {
  Radio,
  ShieldAlert,
  Zap,
  Activity,
  Globe,
  Flame,
  AlertOctagon,
  Layers,
  Send,
  CheckCircle2,
  Filter,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { GLOBAL_THREAT_FEEDS } from '../../server/securityEngine.js';

export const ThreatRadar: React.FC = () => {
  const [threats, setThreats] = useState<any[]>([...GLOBAL_THREAT_FEEDS]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedThreat, setSelectedThreat] = useState<any>(null);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastTarget, setBroadcastTarget] = useState<string>('');
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Live simulation tick to simulate incoming mempool threats
  useEffect(() => {
    const interval = setInterval(() => {
      const randomThreats = [
        {
          id: `THREAT-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: 'Just now',
          type: 'Mempool Sandwich Sniper',
          network: 'Polygon Amoy',
          targetProtocol: 'Uniswap V3 WETH/USDC',
          lossEstimate: '$1,240 slippage extracted',
          attackerAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
          status: 'INTERCEPTED',
          severity: 'MEDIUM',
          vector: 'Frontrunning victim transfer with aggressive gas bribe tip.'
        },
        {
          id: `THREAT-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: 'Just now',
          type: 'Phishing Signature Attempt',
          network: 'Ethereum Sepolia',
          targetProtocol: 'Web3 Permit Collector',
          lossEstimate: '$18,000 prevented',
          attackerAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
          status: 'BLOCKED_BY_FRAUDSHIELD',
          severity: 'HIGH',
          vector: 'Off-chain gasless permit signature rejected by AI engine heuristics.'
        }
      ];

      const newThreat = randomThreats[Math.floor(Math.random() * randomThreats.length)];
      setThreats((prev) => [newThreat, ...prev.slice(0, 19)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTarget) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      const alertThreat = {
        id: `THREAT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        type: 'Zero-Day Contract Exploit (Validator Alert)',
        network: 'Cross-Chain / Polygon Amoy',
        targetProtocol: broadcastTarget,
        lossEstimate: '$0 (Early Defense)',
        attackerAddress: '0x000000000000000000000000000000000000dead',
        status: 'DAO_ALERT_BROADCAST',
        severity: 'CRITICAL',
        vector: broadcastMessage || 'Urgent incident alert broadcasted by DAO Security Validator node.'
      };

      setThreats((prev) => [alertThreat, ...prev]);
      setIsBroadcasting(false);
      setShowBroadcastModal(false);
      setBroadcastTarget('');
      setBroadcastMessage('');
      setToast('🚨 Emergency Threat Broadcasted across all validator nodes!');
      setTimeout(() => setToast(null), 4000);
    }, 800);
  };

  const filteredThreats = threats.filter((t) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'CRITICAL') return t.severity === 'CRITICAL';
    if (filterType === 'HIGH') return t.severity === 'HIGH';
    return t.type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-surface-900 border border-cyber-rose text-cyber-rose shadow-2xl flex items-center gap-3 animate-slideUp font-mono text-xs">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner & DEFCON Gauge */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-900 via-surface-950 to-surface-900 border border-slate-800 p-6 md:p-8">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyber-rose/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-rose/15 border border-cyber-rose/30 text-cyber-rose text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Web3 SIEM & Telemetry Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Global Threat Radar & SIEM
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Live radar monitoring cross-chain flashloan attacks, mempool sandwich bots, phishing permit harvesters, and malicious smart contract deployments in real-time.
            </p>
          </div>

          {/* DEFCON Level Gauge */}
          <div className="flex items-center gap-4 bg-surface-950/90 border border-cyber-rose/40 p-4 rounded-2xl shrink-0 shadow-glowRose/10">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-cyber-rose/10 border border-cyber-rose/50">
              <AlertOctagon className="w-8 h-8 text-cyber-rose animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Network Threat Status
              </div>
              <div className="text-xl font-extrabold font-mono text-cyber-rose">
                DEFCON 2 : ELEVATED
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                14 active mitigations today
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-950 border border-slate-800">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>24h Exploits Detected</span>
            <Activity className="w-3.5 h-3.5 text-cyber-rose" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">28 Incidents</div>
          <div className="text-[11px] font-mono text-cyber-emerald mt-1">100% Intercepted</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-950 border border-slate-800">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Value Protected</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">$4.21M USD</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Across 4 testnets</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-950 border border-slate-800">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Active Honeypots</span>
            <Flame className="w-3.5 h-3.5 text-cyber-amber" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">112 Flagged</div>
          <div className="text-[11px] font-mono text-cyber-amber mt-1">Blacklisted via DAO</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-950 border border-slate-800">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Validator Nodes</span>
            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">9 / 9 Online</div>
          <div className="text-[11px] font-mono text-cyber-cyan mt-1">Consensus Synced</div>
        </div>
      </div>

      {/* Threat Filter & Emergency Broadcast Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-surface-950 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Vector:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'Flash Loan', 'Phishing', 'Honeypot'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                filterType === type
                  ? 'bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/40 font-bold'
                  : 'bg-surface-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowBroadcastModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-rose to-red-600 hover:opacity-90 text-white font-mono font-bold text-xs transition-all shadow-glowRose/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Threat Alert</span>
        </button>
      </div>

      {/* Live Threat Stream List */}
      <div className="space-y-3">
        {filteredThreats.map((threat) => {
          const isCritical = threat.severity === 'CRITICAL';
          const isHigh = threat.severity === 'HIGH';

          return (
            <div
              key={threat.id}
              onClick={() => setSelectedThreat(threat)}
              className={`p-5 rounded-2xl bg-surface-950 border transition-all cursor-pointer hover:scale-[1.005] ${
                isCritical
                  ? 'border-cyber-rose/50 hover:border-cyber-rose bg-cyber-rose/5'
                  : isHigh
                  ? 'border-cyber-amber/50 hover:border-cyber-amber bg-cyber-amber/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                    <Radio className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">{threat.type}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'bg-cyber-rose/20 text-cyber-rose border-cyber-rose/40'
                            : isHigh
                            ? 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/40'
                            : 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40'
                        }`}
                      >
                        {threat.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{threat.timestamp}</span>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      Target: <span className="text-slate-200 font-bold">{threat.targetProtocol}</span> • Network: <span className="text-cyber-cyan">{threat.network}</span>
                    </div>

                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                      {threat.vector}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex md:flex-col items-center md:items-end justify-between gap-1 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  <div className="text-xs font-mono text-cyber-emerald font-bold">
                    {threat.status}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Loss: <span className="text-slate-200">{threat.lossEstimate}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    ID: {threat.id}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Threat Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-950 border border-cyber-rose/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-cyber-rose" />
                Emergency Validator Broadcast
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Target Protocol / Contract Name</label>
                <input
                  type="text"
                  required
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  placeholder="e.g. Unverified Yield Farm / Drainer Portal"
                  className="w-full bg-surface-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-rose"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Threat Vector / Technical Details</label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Explain vulnerability or malicious behavior observed..."
                  className="w-full bg-surface-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyber-rose"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyber-rose hover:bg-rose-600 text-white font-bold transition-all disabled:opacity-50"
                >
                  {isBroadcasting ? 'Broadcasting...' : 'Broadcast to SIEM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
