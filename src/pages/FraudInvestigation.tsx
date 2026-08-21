import React, { useState } from 'react';
import { useFraudShield } from '../context/FraudShieldContext';
import { useWeb3 } from '../context/Web3Context';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  ShieldAlert,
  Upload,
  Database,
  FileCheck,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers
} from 'lucide-react';
import { formatAddress, formatTxHash } from '../utils/blockchain';

export const FraudInvestigation: React.FC = () => {
  const { submitInvestigationReport, reports, currentAnalysis } = useFraudShield();
  const { address: reporterAddress, currentNetwork, currentRole } = useWeb3();

  // Investigation form state pre-populated with active analysis if available
  const [targetWallet, setTargetWallet] = useState(currentAnalysis?.to || '0xd8d4F3879a978680d28765275e7A837f48e30000');
  const [txHash, setTxHash] = useState(currentAnalysis?.txHash || '0x9a8f21e5b8d774a1239bc7a9e01f5682910fae13d987e914cb2990aa415c8921');
  const [amountEth, setAmountEth] = useState(currentAnalysis?.amount ? String(currentAnalysis.amount) : '85.0');
  const [aiRiskScore, setAiRiskScore] = useState(currentAnalysis?.riskScore ? String(currentAnalysis.riskScore) : '94');
  const [evidenceTitle, setEvidenceTitle] = useState('Inferno Phishing Batch Analysis Dossier');
  const [evidenceNotes, setEvidenceNotes] = useState(
    currentAnalysis?.explanation ||
    'Identified unauthorized permit drainer payload interacting with blacklisted address pool with excessive gas fee frontrunning.'
  );
  const [fileAttached, setFileAttached] = useState<string | null>('decompiled_bytecode_trace.json');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newReport = await submitInvestigationReport({
      targetWallet,
      txHash,
      amountEth: parseFloat(amountEth),
      aiRiskScore: parseInt(aiRiskScore, 10),
      aiDiagnosisSummary: evidenceNotes,
      evidenceTitle,
      evidenceNotes,
      reporter: reporterAddress,
      network: currentNetwork.name
    });
    setSubmittedReport(newReport);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyber-rose" />
            Security Investigator Forensic Workspace
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Compile cryptographic evidence dossiers, pin artifacts to IPFS, and mint immutable on-chain fraud reports.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30">
          Role: {currentRole}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 glass-panel p-6 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyber-cyan" />
              Compose Fraud Report & IPFS Proof
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Step 1: Off-Chain Dossier</span>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">TARGET SUSPECT WALLET ADDRESS</label>
              <input
                type="text"
                value={targetWallet}
                onChange={(e) => setTargetWallet(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-rose text-white text-xs font-mono outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">TRANSACTION HASH</label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">AMOUNT (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amountEth}
                  onChange={(e) => setAmountEth(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">AI RISK SCORE (0-100)</label>
                <input
                  type="number"
                  value={aiRiskScore}
                  onChange={(e) => setAiRiskScore(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">DOSSIER TITLE</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-mono outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">FORENSIC ANALYSIS & EVIDENCE SUMMARY</label>
              <textarea
                rows={4}
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-slate-800 focus:border-cyber-cyan text-white text-xs font-sans outline-none leading-relaxed"
                required
              />
            </div>

            {/* Evidence File Attachment Zone */}
            <div className="p-4 rounded-xl bg-surface-900/60 border border-dashed border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyber-teal" />
                  Attach Evidence Artifacts (Screenshots, Logs, Bytecode)
                </span>
                <span className="text-[10px] text-cyber-teal">IPFS Auto-Pinning</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="evidenceUpload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileAttached(e.target.files[0].name);
                    }
                  }}
                />
                <label
                  htmlFor="evidenceUpload"
                  className="px-3 py-1.5 rounded-lg bg-surface-850 hover:bg-surface-800 border border-slate-700 text-slate-200 cursor-pointer text-xs font-mono transition-colors"
                >
                  Choose File
                </label>
                <span className="text-xs text-slate-400 truncate">
                  {fileAttached || 'No file chosen (using default forensic bundle)'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-rose to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-extrabold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-glowRose/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Hashing to IPFS & Broadcasting to Smart Contract...</span>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Pin to IPFS & Submit to FraudRegistry.sol</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Submission Status & Active Reports */}
        <div className="lg:col-span-5 space-y-6">
          {submittedReport && (
            <div className="glass-panel p-5 border border-cyber-emerald/40 bg-cyber-emerald/5 rounded-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-cyber-emerald font-mono font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                REPORT RECORDED ON-CHAIN & PINNED TO IPFS
              </div>
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <div>Case ID: <strong className="text-white">#{submittedReport.reportId}</strong></div>
                <div>IPFS CID: <strong className="text-cyber-cyan break-all">{submittedReport.ipfsEvidenceCID}</strong></div>
                <div>Status: <strong className="text-cyber-amber">Voting Active (Quorum: 3 Validators)</strong></div>
              </div>
            </div>
          )}

          {/* Active Reports under Investigation */}
          <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Active Cases in Registry
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {reports.length} Open/Resolved
              </span>
            </div>

            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.reportId}
                  className="p-3.5 rounded-xl bg-surface-900 border border-slate-800 space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyber-cyan">CASE #{r.reportId}</span>
                    <RiskBadge score={r.aiRiskScore} size="sm" />
                  </div>
                  <h5 className="font-bold text-slate-200 font-sans">{r.evidenceTitle}</h5>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>Target: {formatAddress(r.targetWallet, 3)}</span>
                    <span className="text-cyber-amber font-bold">
                      {r.yesVotes}/{r.requiredQuorum} Votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
