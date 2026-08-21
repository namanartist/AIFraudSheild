import React from 'react';

interface QuorumProgressProps {
  yesVotes: number;
  noVotes: number;
  requiredQuorum: number;
}

export const QuorumProgress: React.FC<QuorumProgressProps> = ({
  yesVotes,
  noVotes,
  requiredQuorum
}) => {
  const totalVotes = yesVotes + noVotes;
  const progressPercent = Math.min(100, Math.round((totalVotes / requiredQuorum) * 100));

  const yesPercent = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercent = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>
          VALIDATOR CONSENSUS ({totalVotes}/{requiredQuorum} QUORUM)
        </span>
        <span className="font-bold text-slate-200">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Split Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex border border-slate-800">
        <div
          className="bg-cyber-rose transition-all duration-500"
          style={{ width: `${(yesVotes / requiredQuorum) * 100}%` }}
          title={`Valid Fraud: ${yesVotes}`}
        />
        <div
          className="bg-cyber-emerald transition-all duration-500"
          style={{ width: `${(noVotes / requiredQuorum) * 100}%` }}
          title={`False Positive: ${noVotes}`}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span className="text-cyber-rose">
          ● Fraud: <strong>{yesVotes}</strong> ({yesPercent.toFixed(0)}%)
        </span>
        <span className="text-cyber-emerald">
          ● False Positive: <strong>{noVotes}</strong> ({noPercent.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
};
