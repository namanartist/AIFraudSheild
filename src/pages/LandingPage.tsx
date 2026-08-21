import React from 'react';
import {
  Shield,
  Cpu,
  Database,
  Blocks,
  Scale,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Activity,
  Zap,
  Award
} from 'lucide-react';
import { WorkflowVisualizer } from '../components/visualizer/WorkflowVisualizer';
import { DemoScenarioBanner } from '../components/common/DemoScenarioBanner';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* 1-Click Demo Scenarios Bar */}
      <DemoScenarioBanner />

      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden text-center max-w-5xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-6 shadow-glowCyan/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DECENTRALIZED FRAUD INTELLIGENCE PROTOCOL v2.4</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-tight">
          AI Intelligence. <br />
          <span className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-emerald bg-clip-text text-transparent glow-text-cyan">
            Decentralized Trust.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans">
          Detect blockchain fraud before it becomes a threat. Combining Machine Learning anomaly detection, IPFS cryptographic evidence proofs, and decentralized DAO validator consensus into an immutable wallet reputation network.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:from-cyan-400 hover:to-blue-500 text-void font-extrabold text-sm font-mono flex items-center gap-2 transition-all shadow-glowCyan/30 hover:scale-105"
          >
            <Cpu className="w-4 h-4" />
            <span>Analyze Transaction</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3.5 rounded-xl bg-surface-900 hover:bg-surface-850 border border-slate-700 hover:border-cyber-purple text-white font-bold text-sm font-mono flex items-center gap-2 transition-all"
          >
            <Activity className="w-4 h-4 text-cyber-purple" />
            <span>Open Security Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('architecture')}
            className="px-5 py-3.5 rounded-xl bg-surface-900/60 hover:bg-surface-900 border border-slate-800 text-slate-300 text-sm font-mono flex items-center gap-2 transition-all"
          >
            <span>Architecture Flow</span>
          </button>
        </div>

        {/* Live Security Metrics Stats Ticker */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Transactions Analyzed</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">142,980+</p>
          </div>
          <div className="glass-panel p-4 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase">AI Detection Accuracy</span>
            <p className="text-2xl font-bold font-mono text-cyber-emerald mt-1">96.4%</p>
          </div>
          <div className="glass-panel p-4 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Protected Wallets</span>
            <p className="text-2xl font-bold font-mono text-cyber-cyan mt-1">12,450</p>
          </div>
          <div className="glass-panel p-4 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase">DAO Consensus Quorum</span>
            <p className="text-2xl font-bold font-mono text-cyber-amber mt-1">3/3 Votes</p>
          </div>
        </div>
      </section>

      {/* End-to-End Visualizer Section */}
      <section className="max-w-6xl mx-auto px-4">
        <WorkflowVisualizer />
      </section>

      {/* 4 Core Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white font-sans">
            How AI FraudShield Protects Web3 Ecosystems
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Bridging off-chain neural intelligence with on-chain cryptographic consensus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 border border-cyber-cyan/20 hover:border-cyber-cyan/50 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-cyber-cyan/10 text-cyber-cyan w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">1. AI Risk Engine</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Analyzes transfer velocity, contract interaction entropy, mixer proximity, and gas anomalies to output explainable 0–100 risk scores.
            </p>
          </div>

          <div className="glass-panel p-6 border border-cyber-teal/20 hover:border-cyber-teal/50 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-cyber-teal/10 text-cyber-teal w-fit">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">2. IPFS Evidence Vault</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Investigator dossiers, forensic logs, and decompiled bytecode traces are pinned to IPFS, generating immutable SHA-256 CIDs.
            </p>
          </div>

          <div className="glass-panel p-6 border border-cyber-amber/20 hover:border-cyber-amber/50 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-cyber-amber/10 text-cyber-amber w-fit">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">3. DAO Verification</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Decentralized staked validators audit evidence dossiers, vote on cases, and reach quorum consensus to eliminate false positives.
            </p>
          </div>

          <div className="glass-panel p-6 border border-cyber-emerald/20 hover:border-cyber-emerald/50 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-cyber-emerald/10 text-cyber-emerald w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">4. Wallet Reputation</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Smart contracts dynamically update on-chain wallet trust metrics, while DAO verified ground truths feed back to retrain AI models.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
