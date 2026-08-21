import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Search,
  Zap,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Lock,
  Unlock,
  Coins,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { PRESET_HONEYPOT_TOKENS, analyzeHoneypot } from '../../server/securityEngine.js';

export const HoneypotDetector: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState<string>('0x87230146e138d3F296a9a77e497A2A83012e9Bc5');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    handleRunCheck(tokenAddress);
  }, []);

  const handleRunCheck = (targetAddr: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      try {
        const res = analyzeHoneypot(targetAddr);
        setAnalysisResult(res);
      } catch (err) {
        console.error('Honeypot check error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 400);
  };

  const handleSelectPreset = (addr: string) => {
    setTokenAddress(addr);
    handleRunCheck(addr);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-900 via-surface-950 to-surface-900 border border-slate-800 p-6 md:p-8">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-purple/15 border border-cyber-purple/30 text-cyber-purple text-xs font-mono">
            <Flame className="w-3.5 h-3.5" />
            <span>Automated DEX Liquidity & Anti-Dump Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Token Honeypot & Phishing Detector
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Simulate live buy and sell swap transactions to expose un-sellable tokens, predatory 100% sell taxes, hidden mint backdoors, and blacklisted transfer hooks before you trade.
          </p>
        </div>
      </div>

      {/* Preset Quick Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyber-purple" /> Test Token Vectors:
        </span>
        {Object.entries(PRESET_HONEYPOT_TOKENS).map(([key, item]: [string, any]) => (
          <button
            key={key}
            onClick={() => handleSelectPreset(item.address)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              tokenAddress.toLowerCase() === item.address.toLowerCase()
                ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40 font-bold'
                : 'bg-surface-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Search & Input Card */}
      <div className="p-4 rounded-xl bg-surface-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Coins className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="Enter ERC-20 Token Contract Address (0x...)"
            className="w-full bg-surface-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyber-purple"
          />
        </div>
        <button
          onClick={() => handleRunCheck(tokenAddress)}
          disabled={isAnalyzing || !tokenAddress}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 hover:opacity-95 text-white font-bold text-xs font-mono transition-all shadow-glowPurple/20 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Simulating DEX Swap...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Analyze Token Risk</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Verdict Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className={`p-6 rounded-2xl border transition-all ${
                analysisResult.isHoneypot
                  ? 'bg-cyber-rose/10 border-cyber-rose/40'
                  : analysisResult.sellTaxPercent > 10
                  ? 'bg-cyber-amber/10 border-cyber-amber/40'
                  : 'bg-cyber-emerald/10 border-cyber-emerald/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Honeypot Analysis Verdict
                  </div>
                  <h2
                    className={`text-2xl font-extrabold font-mono flex items-center gap-2 ${
                      analysisResult.isHoneypot
                        ? 'text-cyber-rose'
                        : analysisResult.sellTaxPercent > 10
                        ? 'text-cyber-amber'
                        : 'text-cyber-emerald'
                    }`}
                  >
                    {analysisResult.isHoneypot ? (
                      <ShieldAlert className="w-7 h-7" />
                    ) : (
                      <ShieldCheck className="w-7 h-7" />
                    )}
                    {analysisResult.verdict}
                  </h2>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Risk Score</div>
                  <div
                    className={`text-3xl font-extrabold font-mono ${
                      analysisResult.riskScore > 75
                        ? 'text-cyber-rose'
                        : analysisResult.riskScore > 30
                        ? 'text-cyber-amber'
                        : 'text-cyber-emerald'
                    }`}
                  >
                    {analysisResult.riskScore}/100
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs font-mono text-slate-300 leading-relaxed bg-surface-950/60 p-3.5 rounded-xl border border-slate-800">
                {analysisResult.reason}
              </p>

              {/* Tax Gauges */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-950/80 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400">Buy Tax</div>
                  <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                    {analysisResult.buyTaxPercent}%
                  </div>
                  <div className="w-full bg-surface-900 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-cyber-cyan h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, analysisResult.buyTaxPercent * 5)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-950/80 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400">Sell Tax (Dump Tax)</div>
                  <div
                    className={`text-2xl font-bold font-mono mt-1 ${
                      analysisResult.sellTaxPercent >= 50
                        ? 'text-cyber-rose'
                        : analysisResult.sellTaxPercent > 10
                        ? 'text-cyber-amber'
                        : 'text-cyber-emerald'
                    }`}
                  >
                    {analysisResult.sellTaxPercent}%
                  </div>
                  <div className="w-full bg-surface-900 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${
                        analysisResult.sellTaxPercent >= 50
                          ? 'bg-cyber-rose'
                          : 'bg-cyber-emerald'
                      }`}
                      style={{ width: `${Math.min(100, analysisResult.sellTaxPercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tokenomics & Contract Attributes */}
            <div className="p-5 rounded-2xl bg-surface-950 border border-slate-800 space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Security & Ownership Attributes
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-slate-800">
                  <span className="text-slate-400">Liquidity Locked</span>
                  {analysisResult.liquidityLocked ? (
                    <span className="text-cyber-emerald font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> YES
                    </span>
                  ) : (
                    <span className="text-cyber-rose font-bold flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> NO / UNVERIFIED
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-slate-800">
                  <span className="text-slate-400">Owner Can Mint</span>
                  {analysisResult.ownerCanMint ? (
                    <span className="text-cyber-rose font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> YES (BACKDOOR)
                    </span>
                  ) : (
                    <span className="text-cyber-emerald font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> RENOUNCED
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-slate-800">
                  <span className="text-slate-400">Transfer Blacklist</span>
                  {analysisResult.transferBlacklistActive ? (
                    <span className="text-cyber-rose font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> DETECTED
                    </span>
                  ) : (
                    <span className="text-cyber-emerald font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> NONE
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-slate-800">
                  <span className="text-slate-400">Trading Cooldown Trap</span>
                  {analysisResult.tradingCoolDown ? (
                    <span className="text-cyber-amber font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-cyber-emerald font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> NORMAL
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DEX Swap Simulation Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-surface-950 border border-slate-800 space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyber-cyan" />
                Live DEX Swap Simulation
              </h3>

              {/* Buy Simulation */}
              <div className="p-3.5 rounded-xl bg-surface-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">1. Simulated Buy (1.0 ETH)</span>
                  <span className="text-cyber-emerald font-bold bg-cyber-emerald/10 px-2 py-0.5 rounded border border-cyber-emerald/30">
                    {analysisResult.simulation.buy.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Received Tokens:</span>
                    <span className="text-slate-200">
                      {analysisResult.simulation.buy.receivedTokens.toLocaleString()} {analysisResult.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas Used:</span>
                    <span className="text-slate-200">
                      {analysisResult.simulation.buy.gasUsed.toLocaleString()} gas
                    </span>
                  </div>
                </div>
              </div>

              {/* Sell Simulation */}
              <div className="p-3.5 rounded-xl bg-surface-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">2. Simulated Liquidation (Sell)</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded border ${
                      analysisResult.simulation.sell.status.includes('REVERTED')
                        ? 'text-cyber-rose bg-cyber-rose/10 border-cyber-rose/30'
                        : 'text-cyber-emerald bg-cyber-emerald/10 border-cyber-emerald/30'
                    }`}
                  >
                    {analysisResult.simulation.sell.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Returned ETH:</span>
                    <span className="text-slate-200">
                      {analysisResult.simulation.sell.receivedEth.toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Slippage:</span>
                    <span className="text-slate-200">
                      {analysisResult.simulation.slippageRequired}
                    </span>
                  </div>
                </div>
              </div>

              {/* General Info */}
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono space-y-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="text-slate-200">{analysisResult.network}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Pool Liquidity:</span>
                  <span className="text-slate-200">{analysisResult.liquidityUsd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Holders:</span>
                  <span className="text-slate-200">{analysisResult.holderCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
