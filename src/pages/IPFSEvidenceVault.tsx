import React, { useState } from 'react';
import { useFraudShield } from '../context/FraudShieldContext';
import { EvidenceViewer } from '../components/ipfs/EvidenceViewer';
import { Database, Search, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export const IPFSEvidenceVault: React.FC = () => {
  const { evidenceStore } = useFraudShield();
  const [searchCID, setSearchCID] = useState('');

  const filteredEvidence = evidenceStore.filter((e) =>
    e.cid.toLowerCase().includes(searchCID.toLowerCase()) ||
    e.title.toLowerCase().includes(searchCID.toLowerCase()) ||
    e.targetWallet.toLowerCase().includes(searchCID.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Database className="w-5 h-5 text-cyber-teal" />
            Decentralized IPFS Evidence Vault
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Cryptographic storage containing forensic logs, decompiled traces, and affidavits with immutable CIDv1 hashes.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded bg-cyber-teal/15 text-cyber-teal border border-cyber-teal/30">
          {evidenceStore.length} Pinned Artifacts
        </span>
      </div>

      {/* CID Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          value={searchCID}
          onChange={(e) => setSearchCID(e.target.value)}
          placeholder="Filter by IPFS CID, case title, or target address..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-900 border border-slate-800 focus:border-cyber-teal text-white text-xs font-mono outline-none"
        />
      </div>

      {/* Grid of Evidence Artifacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvidence.map((ev) => (
          <EvidenceViewer key={ev.cid} evidence={ev} />
        ))}
      </div>
    </div>
  );
};
