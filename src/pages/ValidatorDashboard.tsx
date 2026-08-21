import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Users, Award, ShieldCheck, Scale, TrendingUp, Droplets, CheckCircle2 } from 'lucide-react';
import { formatAddress } from '../utils/blockchain';

export const ValidatorDashboard: React.FC = () => {
  const { currentRole, address } = useWeb3();

  const validatorsList = [
    {
      address: '0x9F41FfB0b64d1C5e3c880193498801948842c812',
      name: 'Validator Node #04 (You)',
      stakeEth: 32.0,
      verifiedCases: 89,
      consensusAccuracy: 99.1,
      status: 'Active',
      rewardsEarned: '4.82 POL'
    },
    {
      address: '0x22A9471928347192834719283471928347192834',
      name: 'ChainSecurity Sentinel',
      stakeEth: 64.0,
      verifiedCases: 142,
      consensusAccuracy: 98.7,
      status: 'Active',
      rewardsEarned: '8.14 POL'
    },
    {
      address: '0x88F1029384756102938475610293847561029384',
      name: 'OpenZeppelin Forensics',
      stakeEth: 50.0,
      verifiedCases: 110,
      consensusAccuracy: 99.4,
      status: 'Active',
      rewardsEarned: '6.50 POL'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Users className="w-5 h-5 text-cyber-amber" />
            Validator Staking & Governance Staking Portal
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Stake collateral, participate in fraud verification quorums, and earn protocol rewards.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded bg-cyber-amber/15 text-cyber-amber border border-cyber-amber/30">
          Role: {currentRole}
        </span>
      </div>

      {/* Validator Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">ACTIVE VALIDATORS</span>
          <p className="text-2xl font-bold text-white mt-1">9 Nodes</p>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">TOTAL VALUE STAKED</span>
          <p className="text-2xl font-bold text-cyber-cyan mt-1">285.0 ETH</p>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">CONSENSUS RATE</span>
          <p className="text-2xl font-bold text-cyber-emerald mt-1">99.2%</p>
        </div>
        <div className="glass-panel p-4 border border-slate-800 font-mono">
          <span className="text-slate-400 text-[10px] uppercase">TOTAL REWARDS PAID</span>
          <p className="text-2xl font-bold text-cyber-amber mt-1">42.8 POL</p>
        </div>
      </div>

      {/* Validator Nodes Table */}
      <div className="glass-panel p-5 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Active Consensus Node Registry
          </h4>
          <span className="text-[10px] font-mono text-slate-400">FraudShieldDAO.sol</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="pb-3">NODE OPERATOR</th>
                <th className="pb-3">STAKE (ETH)</th>
                <th className="pb-3">VERIFIED CASES</th>
                <th className="pb-3">ACCURACY</th>
                <th className="pb-3">REWARDS</th>
                <th className="pb-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {validatorsList.map((val) => (
                <tr key={val.address} className="hover:bg-surface-900/60 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-white">{val.name}</div>
                    <div className="text-[10px] text-slate-500">{formatAddress(val.address, 4)}</div>
                  </td>
                  <td className="py-3 font-bold text-cyber-cyan">{val.stakeEth} ETH</td>
                  <td className="py-3 text-slate-200">{val.verifiedCases}</td>
                  <td className="py-3 text-cyber-emerald font-bold">{val.consensusAccuracy}%</td>
                  <td className="py-3 text-cyber-amber">{val.rewardsEarned}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 text-[10px]">
                      {val.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
