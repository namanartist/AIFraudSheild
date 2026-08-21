import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface FeatureRadarProps {
  metrics?: {
    avgAmountEth: number;
    frequencyPerHour: number;
    gasAnomalyIndex: number;
    mixerProximity: number;
    contractCallRatio: number;
    recipientEntropy: number;
  };
  currentAmount?: number;
  currentRiskScore?: number;
}

export const FeatureRadar: React.FC<FeatureRadarProps> = ({
  metrics,
  currentAmount = 1.0,
  currentRiskScore = 30
}) => {
  const data = [
    {
      subject: 'Amount Outlier',
      value: Math.min(100, (currentAmount > 10 ? (currentAmount / 50) * 100 : 20)),
      baseline: 25,
      fullMark: 100
    },
    {
      subject: 'Velocity Burst',
      value: metrics ? metrics.frequencyPerHour * 10 : (currentRiskScore > 70 ? 90 : 20),
      baseline: 30,
      fullMark: 100
    },
    {
      subject: 'Mixer Proximity',
      value: metrics ? metrics.mixerProximity * 100 : (currentRiskScore > 70 ? 85 : 5),
      baseline: 10,
      fullMark: 100
    },
    {
      subject: 'Gas Deviation',
      value: metrics ? metrics.gasAnomalyIndex * 100 : (currentRiskScore > 70 ? 80 : 15),
      baseline: 20,
      fullMark: 100
    },
    {
      subject: 'Contract Interaction',
      value: metrics ? metrics.contractCallRatio * 100 : 45,
      baseline: 40,
      fullMark: 100
    },
    {
      subject: 'Address Entropy',
      value: metrics ? metrics.recipientEntropy * 100 : 75,
      baseline: 70,
      fullMark: 100
    }
  ];

  return (
    <div className="w-full h-64 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
          <Radar
            name="Normal Baseline"
            dataKey="baseline"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.15}
          />
          <Radar
            name="Analyzed Transaction"
            dataKey="value"
            stroke={currentRiskScore > 70 ? '#f43f5e' : '#00f0ff'}
            fill={currentRiskScore > 70 ? '#f43f5e' : '#00f0ff'}
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0c142b',
              borderColor: '#1e293b',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '11px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
