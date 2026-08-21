import React from 'react';
import { useFraudShield } from '../context/FraudShieldContext';
import { useWeb3 } from '../context/Web3Context';
import { VoteCard } from '../components/dao/VoteCard';
import {
  Scale,
  Users,
  ShieldCheck,
  Award,
  Vote,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DAOVerification: React.FC = () => {
  const { reports } = useFraudShield();
  const { currentRole } = useWeb3();

  const votingCases = reports.filter((r) => !r.isResolved);
  const resolvedCases = reports.filter((r) => r.isResolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyber-amber" />
            Decentralized Validator Verification Quorum
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Community consensus governance verifying AI-flagged fraud cases and updating on-chain trust scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded bg-cyber-amber/15 text-cyber-amber border border-cyber-amber/30">
            Current Persona: {currentRole}
          </span>
        </div>
      </div>

      {/* DAO Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 uppercase text-[10px]">ACTIVE VOTING CASES</span>
          <p className="text-2xl font-bold text-cyber-amber mt-1">{votingCases.length}</p>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 uppercase text-[10px]">RESOLVED CASES</span>
          <p className="text-2xl font-bold text-cyber-emerald mt-1">{resolvedCases.length}</p>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 uppercase text-[10px]">REQUIRED QUORUM</span>
          <p className="text-2xl font-bold text-white mt-1">3 Validators</p>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 uppercase text-[10px]">CONSENSUS THRESHOLD</span>
          <p className="text-2xl font-bold text-cyber-cyan mt-1">&ge; 66.7% Majority</p>
        </div>
      </div>

      {/* Voting Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyber-amber" />
            Active Voting Session Queue
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            {votingCases.length} Cases Pending Consensus
          </span>
        </div>

        {votingCases.length === 0 ? (
          <div className="glass-panel p-12 border border-slate-800 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-cyber-emerald mx-auto" />
            <h4 className="text-sm font-bold text-white font-mono">All Reports Resolved</h4>
            <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
              No cases currently pending validator consensus votes. New flagged transactions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {votingCases.map((r) => (
              <VoteCard key={r.reportId} report={r} />
            ))}
          </div>
        )}
      </div>

      {/* Historical Resolved Cases */}
      {resolvedCases.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
              Resolved & Finalized On-Chain Cases
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {resolvedCases.length} Cases Executed
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resolvedCases.map((r) => (
              <VoteCard key={r.reportId} report={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
