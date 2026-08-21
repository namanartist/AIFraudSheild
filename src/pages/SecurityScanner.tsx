import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Zap,
  Download,
  Terminal,
  Bug,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  Flame,
  Code2
} from 'lucide-react';
import { PRESET_CONTRACTS, scanSmartContract } from '../../server/securityEngine.js';

export const SecurityScanner: React.FC = () => {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('vulnerableDAO');
  const [code, setCode] = useState<string>('');
  const [contractName, setContractName] = useState<string>('VulnerableVault');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [copiedDiffId, setCopiedDiffId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'vulnerabilities' | 'remediations' | 'rawCode'>('vulnerabilities');

  useEffect(() => {
    const preset = (PRESET_CONTRACTS as any)[selectedPresetKey];
    if (preset) {
      setCode(preset.code);
      setContractName(preset.name);
      handleScan(preset.code, preset.name);
    }
  }, [selectedPresetKey]);

  const handleScan = (customCode?: string, name?: string) => {
    setIsScanning(true);
    const targetCode = customCode !== undefined ? customCode : code;
    const targetName = name || contractName;

    setTimeout(() => {
      try {
        const result = scanSmartContract(targetCode, targetName);
        setAuditResult(result);
      } catch (err) {
        console.error('Scan failed:', err);
      } finally {
        setIsScanning(false);
      }
    }, 450);
  };

  const handleCopyDiff = (diffText: string, id: string) => {
    navigator.clipboard.writeText(diffText);
    setCopiedDiffId(id);
    setTimeout(() => setCopiedDiffId(null), 2000);
  };

  const handleExportReport = () => {
    if (!auditResult) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(auditResult, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `security_audit_${contractName.replace(/\s+/g, '_')}_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-cyber-rose/20 text-cyber-rose border-cyber-rose/40 animate-pulse';
      case 'HIGH':
        return 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'LOW':
        return 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-900 via-surface-950 to-surface-900 border border-slate-800 p-6 md:p-8">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
              <Code2 className="w-3.5 h-3.5" />
              <span>Static AST & Heuristic Smart Contract Auditor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Contract Vulnerability Scanner
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Inspect Solidity smart contracts for Reentrancy, Signature Drainer payloads, Insecure Authorization, and Arbitrary Delegatecall backdoors with automated remediation code diffs.
            </p>
          </div>

          {auditResult && (
            <div className="flex items-center gap-4 bg-surface-950/80 border border-slate-800 p-4 rounded-xl shrink-0">
              <div className="text-center">
                <div className="text-xs font-mono text-slate-400">Security Score</div>
                <div
                  className={`text-3xl font-extrabold font-mono ${
                    auditResult.securityScore >= 80
                      ? 'text-cyber-emerald'
                      : auditResult.securityScore >= 50
                      ? 'text-cyber-amber'
                      : 'text-cyber-rose'
                  }`}
                >
                  {auditResult.securityScore}/100
                </div>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-xs font-mono text-slate-400">Audit Grade</div>
                <div
                  className={`text-2xl font-bold font-mono ${
                    auditResult.auditGrade.includes('A')
                      ? 'text-cyber-emerald'
                      : auditResult.auditGrade.includes('B')
                      ? 'text-cyber-cyan'
                      : 'text-cyber-rose'
                  }`}
                >
                  {auditResult.auditGrade}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyber-cyan" /> Preloaded Test Vectors:
        </span>
        {Object.entries(PRESET_CONTRACTS).map(([key, preset]: [string, any]) => (
          <button
            key={key}
            onClick={() => setSelectedPresetKey(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedPresetKey === key
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 font-bold'
                : 'bg-surface-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Scanner Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Code Editor & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-surface-950 border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-surface-900/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyber-cyan" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Solidity Source Code (.sol)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">
                  {code.split('\n').length} lines
                </span>
                <button
                  onClick={() => handleScan()}
                  disabled={isScanning}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan text-surface-950 font-bold text-xs font-mono hover:bg-cyan-300 transition-all shadow-glowCyan/20 disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-surface-950 border-t-transparent rounded-full animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Run Security Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={22}
                className="w-full bg-surface-950 p-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/50 leading-relaxed resize-none selection:bg-cyber-cyan/30"
                placeholder="// Paste Solidity Smart Contract Code here..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Right Audit Results & Analysis (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Summary Metrics Card */}
          {auditResult && (
            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-xl bg-surface-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Critical</div>
                <div className="text-lg font-bold font-mono text-cyber-rose">
                  {auditResult.stats.critical}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">High</div>
                <div className="text-lg font-bold font-mono text-cyber-amber">
                  {auditResult.stats.high}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Medium</div>
                <div className="text-lg font-bold font-mono text-yellow-400">
                  {auditResult.stats.medium}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-950 border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Low/Info</div>
                <div className="text-lg font-bold font-mono text-cyber-cyan">
                  {auditResult.stats.low}
                </div>
              </div>
            </div>
          )}

          {/* Tab Selection */}
          <div className="flex rounded-xl bg-surface-900 p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'vulnerabilities'
                  ? 'bg-cyber-cyan/15 text-cyber-cyan font-bold border border-cyber-cyan/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vulnerabilities ({auditResult?.vulnerabilities?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('remediations')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'remediations'
                  ? 'bg-cyber-purple/15 text-cyber-purple font-bold border border-cyber-purple/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Remediation Diffs
            </button>
          </div>

          {/* Audit Findings List */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {auditResult?.vulnerabilities?.length === 0 ? (
              <div className="p-8 rounded-xl bg-surface-950 border border-cyber-emerald/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-cyber-emerald mx-auto" />
                <h3 className="text-base font-bold text-slate-100">Clean Smart Contract</h3>
                <p className="text-xs text-slate-400">
                  No standard static vulnerabilities (Reentrancy, tx.origin, unhandled calls, drainer hooks) were detected.
                </p>
              </div>
            ) : activeTab === 'vulnerabilities' ? (
              auditResult?.vulnerabilities?.map((vuln: any) => (
                <div
                  key={vuln.id}
                  className="p-4 rounded-xl bg-surface-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                            vuln.severity
                          )}`}
                        >
                          {vuln.severity}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Line {vuln.line}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 font-sans">{vuln.title}</h4>
                    </div>
                  </div>

                  {vuln.targetCode && (
                    <div className="p-2 rounded bg-surface-900 border border-slate-800 text-[11px] font-mono text-cyber-rose break-all">
                      <code>{vuln.targetCode}</code>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 leading-relaxed">{vuln.description}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{vuln.id}</span>
                    <button
                      onClick={() => setActiveTab('remediations')}
                      className="text-[11px] font-mono text-cyber-cyan hover:underline flex items-center gap-1"
                    >
                      View Fix <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              auditResult?.vulnerabilities?.map((vuln: any) => (
                <div
                  key={vuln.id}
                  className="p-4 rounded-xl bg-surface-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{vuln.title}</span>
                    <button
                      onClick={() => handleCopyDiff(vuln.diff, vuln.id)}
                      className="text-xs font-mono text-slate-400 hover:text-cyber-cyan flex items-center gap-1"
                    >
                      {copiedDiffId === vuln.id ? (
                        <>
                          <Check className="w-3 h-3 text-cyber-emerald" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Fix
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-900/90 border border-slate-800 text-[11px] font-mono leading-relaxed whitespace-pre-wrap text-slate-300">
                    {vuln.diff}
                  </div>

                  <p className="text-xs text-slate-400 italic font-mono bg-surface-900/40 p-2 rounded border border-slate-800/50">
                    💡 {vuln.remediation}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Export Action Card */}
          {auditResult && (
            <button
              onClick={handleExportReport}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-800 border border-slate-800 text-slate-200 text-xs font-mono font-bold transition-all"
            >
              <Download className="w-4 h-4 text-cyber-cyan" />
              <span>Download Audit Certificate (JSON)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
