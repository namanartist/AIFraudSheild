import React, { useState } from 'react';
import { FraudReport } from '../../types';
import { useFraudShield } from '../../context/FraudShieldContext';
import { useWeb3 } from '../../context/Web3Context';
import { RiskBadge } from '../common/RiskBadge';
import { QuorumProgress } from './QuorumProgress';
import { formatAddress, formatTxHash } from '../../utils/blockchain';
import { formatCID, getIPFSGatewayUrl } from '../../utils/ipfs';
import {
  ShieldAlert,
  Database,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';

interface VoteCardProps {
  report: FraudReport;
}

export const VoteCard: React.FC<VoteCardProps> = ({ report }) => {
  const { castDAOVote } = useFraudShield();
  const { address, currentRole } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVotedLocally, setHasVotedLocally] = useState(false);

  const isValidator = currentRole === 'Validator' || currentRole === 'Admin';

  const handleVote = async (supportFraud: boolean) => {
    setIsSubmitting(true);
    await castDAOVote(report.reportId, supportFraud, address);
    setHasVotedLocally(true);
    setIsSubmitting(false);
  };

  const isVerified = report.status === 'Verified';
  const isRejected = report.status === 'Rejected';
  const isVoting = report.status === 'Voting' || report.status === 'InReview' || report.status === 'Submitted';

  return (
    <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4 hover:border-slate-700 transition-all">
      {/* Header with Case ID and Status Badge */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyber-cyan">
              CASE #{report.reportId}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-850 text-slate-400 border border-slate-700">
              {report.network}
            </span>
            <RiskBadge score={report.aiRiskScore} size="sm" />
          </div>
          <h4 className="text-sm font-bold text-white mt-1.5 font-mono">
            {report.evidenceTitle}
          </h4>
        </div>

        <div>
          {isVerified && (
            <span className="px-2.5 py-1 rounded bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/40 font-mono text-xs font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              VERIFIED FRAUD
            </span>
          )}
          {isRejected && (
            <span className="px-2.5 py-1 rounded bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40 font-mono text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              FALSE POSITIVE / REJECTED
            </span>
          )}
          {isVoting && (
            <span className="px-2.5 py-1 rounded bg-cyber-amber/20 text-cyber-amber border border-cyber-amber/40 font-mono text-xs font-bold flex items-center gap-1 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              VOTING ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Target Wallet and Tx Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-surface-900/80 border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-400 text-[10px] uppercase">TARGET SUSPECT WALLET</span>
          <p className="font-bold text-slate-200 truncate mt-0.5">{report.targetWallet}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase">TRANSACTION HASH</span>
          <p className="text-cyber-cyan truncate mt-0.5">{report.txHash}</p>
        </div>
      </div>

      {/* AI Diagnosis Summary */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans">
        {report.aiDiagnosisSummary}
      </p>

      {/* IPFS Proof Attachment Pill */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-850/80 border border-slate-700/60 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Database className="w-4 h-4 text-cyber-teal" />
          <span>IPFS CID:</span>
          <span className="text-cyber-cyan font-bold">{formatCID(report.ipfsEvidenceCID)}</span>
        </div>
        <a
          href={getIPFSGatewayUrl(report.ipfsEvidenceCID)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] text-cyber-teal hover:underline"
        >
          <span>Gateway Inspect</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Quorum Progress Bar */}
      <QuorumProgress
        yesVotes={report.yesVotes}
        noVotes={report.noVotes}
        requiredQuorum={report.requiredQuorum}
      />

      {/* Validator Voting Action Buttons */}
      {isVoting && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            {isValidator ? (
              <span>Your role has validator voting authority.</span>
            ) : (
              <span className="text-cyber-amber">Switch to 'Validator' role to cast consensus vote.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote(false)}
              disabled={isSubmitting || !isValidator || hasVotedLocally}
              className="px-3 py-1.5 rounded-lg bg-surface-850 hover:bg-surface-800 border border-cyber-emerald/40 text-cyber-emerald text-xs font-mono flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>False Positive</span>
            </button>

            <button
              onClick={() => handleVote(true)}
              disabled={isSubmitting || !isValidator || hasVotedLocally}
              className="px-4 py-1.5 rounded-lg bg-cyber-rose/20 hover:bg-cyber-rose/30 border border-cyber-rose/60 text-cyber-rose font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-glowRose/10 disabled:opacity-40"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Vote: Valid Fraud</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
