import React, { useState } from 'react';
import { IPFSEvidenceRecord } from '../../types';
import { Database, ExternalLink, Copy, Check, FileJson, ShieldCheck } from 'lucide-react';
import { formatCID, getIPFSGatewayUrl } from '../../utils/ipfs';

interface EvidenceViewerProps {
  evidence: IPFSEvidenceRecord;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ evidence }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(evidence.cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-3.5 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyber-teal/15 text-cyber-teal border border-cyber-teal/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">{evidence.title}</h4>
            <span className="text-[10px] font-mono text-slate-400">
              Pinned: {new Date(evidence.timestamp).toLocaleString()} • Size: {evidence.size}
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-cyber-teal/10 text-cyber-teal border border-cyber-teal/30 font-mono text-[10px]">
          CIDv1 SHA-256
        </span>
      </div>

      {/* CID copy bar */}
      <div className="p-2.5 rounded-lg bg-surface-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
        <span className="text-cyber-cyan truncate">{evidence.cid}</span>
        <button
          onClick={handleCopy}
          className="ml-2 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white shrink-0"
          title="Copy IPFS CID"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Structured Payload Peek */}
      <div className="p-3 rounded-lg bg-surface-950/80 border border-slate-800/80 font-mono text-xs overflow-x-auto text-slate-300">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <FileJson className="w-3 h-3 text-cyber-cyan" />
            EVIDENCE METADATA BUNDLE
          </span>
          <span className="text-cyber-emerald flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            IMMUTABLE PROOF
          </span>
        </div>
        <pre className="text-[11px] leading-relaxed">
          {JSON.stringify(evidence.evidenceData, null, 2)}
        </pre>
      </div>

      {/* Gateway buttons */}
      <div className="flex items-center gap-2 pt-1 font-mono text-xs">
        <a
          href={getIPFSGatewayUrl(evidence.cid, 'ipfs.io')}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-1.5 px-3 rounded-lg bg-surface-850 hover:bg-surface-800 border border-slate-700 text-slate-300 hover:text-white text-center flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>IPFS.io Gateway</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href={getIPFSGatewayUrl(evidence.cid, 'pinata')}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-1.5 px-3 rounded-lg bg-surface-850 hover:bg-surface-800 border border-slate-700 text-slate-300 hover:text-white text-center flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Pinata Gateway</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
