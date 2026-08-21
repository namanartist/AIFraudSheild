import React, { useState } from 'react';
import { useFraudShield } from '../context/FraudShieldContext';
import {
  Activity,
  Cpu,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Database,
  CheckCircle2,
  Sliders,
  Scale,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const AIAnalytics: React.FC = () => {
  const { feedbackMetrics, feedbackDataset, triggerModelRetrain } = useFraudShield();
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState<any | null>(null);

  const handleRetrain = async () => {
    setIsRetraining(true);
    const result = await triggerModelRetrain();
    setRetrainResult(result);
    setIsRetraining(false);
  };

  const featureData = feedbackMetrics.featureImportance.map((f) => ({
    name: f.feature,
    weight: Math.round(f.importance * 100)
  }));

  const colors = ['#f43f5e', '#8b5cf6', '#00f0ff', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-purple" />
            Decentralized AI Feedback Loop & Model Governance
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Human-in-the-loop active retraining using DAO validator-verified ground truths.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyan-400 hover:to-purple-500 text-void font-extrabold text-xs font-mono flex items-center gap-2 transition-all shadow-glowCyan/20 disabled:opacity-50"
        >
          {isRetraining ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-void" />
              <span>Optimizing Neural Weights & Decision Trees...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-void" />
              <span>Trigger Model Retrain (DAO Ground Truth)</span>
            </>
          )}
        </button>
      </div>

      {/* Retrain Alert Notification */}
      {retrainResult && (
        <div className="glass-panel p-4 border border-cyber-emerald/40 bg-cyber-emerald/10 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-cyber-emerald" />
            <span className="font-mono text-xs text-slate-200">
              {retrainResult.message} (Accuracy Gain: <strong className="text-cyber-emerald">{retrainResult.accuracyGain}</strong>, False Positive Reduction: <strong className="text-cyber-emerald">{retrainResult.fpReduction}</strong>)
            </span>
          </div>
        </div>
      )}

      {/* Model Benchmark Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">MODEL ACCURACY</span>
          <p className="text-2xl font-bold text-cyber-emerald mt-1">{feedbackMetrics.accuracy}%</p>
          <span className="text-[10px] text-slate-500">Cross-validated</span>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">F1 CLASSIFICATION SCORE</span>
          <p className="text-2xl font-bold text-cyber-cyan mt-1">{feedbackMetrics.f1Score}</p>
          <span className="text-[10px] text-slate-500">Harmonic precision/recall</span>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">ROC-AUC SCORE</span>
          <p className="text-2xl font-bold text-cyber-purple mt-1">{feedbackMetrics.rocAuc}</p>
          <span className="text-[10px] text-slate-500">Separability index</span>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">FALSE POSITIVE RATE</span>
          <p className="text-2xl font-bold text-cyber-rose mt-1">{feedbackMetrics.falsePositiveRate}%</p>
          <span className="text-[10px] text-slate-500">Post-DAO verification</span>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">DAO FEEDBACK SAMPLES</span>
          <p className="text-2xl font-bold text-white mt-1">{feedbackMetrics.totalVerifiedFeedbackSamples}</p>
          <span className="text-[10px] text-cyber-cyan">Ground truths logged</span>
        </div>
      </div>

      {/* Feature Importance Bar Chart & Active Feedback Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Feature Importance */}
        <div className="lg:col-span-6 glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Feature Importance Attribution
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Relative weighting in anomaly classification
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">SHAP Attributions</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c142b',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                  {featureData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: DAO Verified Feedback Queue */}
        <div className="lg:col-span-6 glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyber-teal" />
                Verified Training Feedback Dataset
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Recent cases confirmed by DAO quorum incorporated into retrain batch
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyber-emerald">Ground Truth Ready</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {feedbackDataset.map((sample, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface-900 border border-slate-800 text-xs font-mono space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyber-cyan">Case #{sample.caseId}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sample.daoVerdict === 'VERIFIED_FRAUD'
                        ? 'bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/40'
                        : 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40'
                    }`}
                  >
                    {sample.daoVerdict}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Tx: {sample.txHash}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                  <span>Initial AI Risk: <strong className="text-white">{sample.initialAiScore}/100</strong></span>
                  <span>Consensus: <strong className="text-cyber-amber">{sample.consensusRatio}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
