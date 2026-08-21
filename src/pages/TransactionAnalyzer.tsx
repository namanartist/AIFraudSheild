import React, { useState } from 'react';
import { useFraudShield } from '../context/FraudShieldContext';
import { useWeb3 } from '../context/Web3Context';
import { RiskGauge } from '../components/ai/RiskGauge';
import { ExplainableFactors } from '../components/ai/ExplainableFactors';
import { FeatureRadar } from '../components/ai/FeatureRadar';
import { DemoScenarioBanner } from '../components/common/DemoScenarioBanner';
import {
  Cpu,
  Search,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  FilePlus2,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TransactionAnalyzerProps {
  onNavigate: (page: string) => void;
  prefillTx?: any;
}

export const TransactionAnalyzer: React.FC<TransactionAnalyzerProps> = ({
  onNavigate,
  prefillTx
}) => {
  const { analyzeTx, currentAnalysis, isAnalyzing } = useFraudShield();
  const { currentNetwork } = useWeb3();

  // Form parameters
  const [txHash, setTxHash] = useState(prefillTx?.txHash || '0x9a8f21e5b8d774a1239bc7a9e01f5682910fae13d987e914cb2990aa415c8921');
  const [fromAddress, setFromAddress] = useState(prefillTx?.from || '0xd8d4F3879a978680d28765275e7A837f48e30000');
  const [toAddress, setToAddress] = useState(prefillTx?.to || '0x992384718293487192834719283471928347f7aa');
  const [amount, setAmount] = useState(prefillTx?.amountValue ? String(prefillTx.amountValue) : '85.0');
  const [frequency, setFrequency] = useState('42.0');
  const [walletAgeDays, setWalletAgeDays] = useState('3');
  const [gasGwei, setGasGwei] = useState('180');
  const [contractCallRatio, setContractCallRatio] = useState('0.95');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyzeTx({
      txHash,
      from: fromAddress,
      to: toAddress,
      amount: parseFloat(amount),
      frequencyPerHour: parseFloat(frequency),
      walletAgeDays: parseInt(walletAgeDays, 10),
      gasGwei: parseFloat(gasGwei),
      contractCallRatio: parseFloat(contractCallRatio),
      network: currentNetwork.name
    });
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Demo Scenarios */}
      <DemoScenarioBanner />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyber-cyan" />
            AI Transaction Behavioral Risk Engine
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Real-time inference using Isolation Forest anomaly detection & Random Forest classification.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30">
          Ensemble Model v2.4 (Active)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters Form */}
        <div className="lg:col-span-5 glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyber-cyan" />
              Transaction Feature Parameters
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live Feature Extractor</span>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-3.5 text-xs font-mono">
            {/* Tx Hash */}
            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">TRANSACTION HASH</label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                placeholder="0x..."
                required
              />
            </div>

            {/* From & To Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">SENDER ADDRESS</label>
                <input
                  type="text"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  placeholder="0x..."
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">RECIPIENT / CONTRACT</label>
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  placeholder="0x..."
                  required
                />
              </div>
            </div>

            {/* Amount & Frequency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">AMOUNT (ETH / POL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">VELOCITY (TX/HR)</label>
                <input
                  type="number"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
            </div>

            {/* Wallet Age & Gas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">WALLET AGE (DAYS)</label>
                <input
                  type="number"
                  value={walletAgeDays}
                  onChange={(e) => setWalletAgeDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">GAS PRICE (GWEI)</label>
                <input
                  type="number"
                  value={gasGwei}
                  onChange={(e) => setGasGwei(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:from-cyan-400 hover:to-blue-500 text-void font-extrabold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-glowCyan/20 disabled:opacity-50 mt-4"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Features & Running Inference...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Execute AI Risk Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: AI Prediction & Explainable Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          {currentAnalysis ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score & Radar Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-5 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
                  <RiskGauge
                    score={currentAnalysis.riskScore}
                    confidenceScore={currentAnalysis.confidenceScore}
                    category={currentAnalysis.riskCategory}
                  />
                </div>

                <div className="glass-panel p-5 border border-slate-800 rounded-xl">
                  <div className="pb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>BEHAVIORAL ANOMALY RADAR</span>
                    <span className="text-cyber-cyan font-bold">Deviation Index</span>
                  </div>
                  <FeatureRadar
                    currentAmount={currentAnalysis.amount}
                    currentRiskScore={currentAnalysis.riskScore}
                  />
                </div>
              </div>

              {/* Explainable AI Factor Breakdown */}
              <div className="glass-panel p-5 border border-slate-800 rounded-xl">
                <ExplainableFactors
                  factors={currentAnalysis.factors}
                  explanation={currentAnalysis.explanation}
                  recommendation={currentAnalysis.recommendation}
                />
              </div>

              {/* Action Button: Push to Investigation Studio */}
              {currentAnalysis.riskScore > 30 && (
                <div className="p-4 rounded-xl bg-cyber-rose/10 border border-cyber-rose/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-cyber-rose flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Suspicious Anomaly Confirmed by AI
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Create an official forensic investigation dossier and pin evidence to IPFS for DAO verification.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('investigation')}
                    className="px-4 py-2 rounded-xl bg-cyber-rose hover:bg-rose-600 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow-glowRose/30"
                  >
                    <FilePlus2 className="w-4 h-4" />
                    <span>Create Fraud Dossier</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 rounded-2xl bg-surface-900 border border-slate-800 text-slate-400">
                <Cpu className="w-8 h-8 text-cyber-cyan animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono">No Active Inference</h3>
              <p className="text-xs text-slate-400 font-mono max-w-sm">
                Enter transaction parameters on the left or launch one of the 1-Click Demo Scenarios above to generate explainable risk scores.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
