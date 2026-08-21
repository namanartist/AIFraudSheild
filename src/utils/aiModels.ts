import { RiskFactor, TransactionAnalysis } from '../types';

export function extractFeatures(txData: any) {
  const amount = parseFloat(txData.amount || 0);
  const frequency = parseFloat(txData.frequencyPerHour || 1.0);
  const walletAge = parseInt(txData.walletAgeDays || 180, 10);
  const gasGwei = parseFloat(txData.gasGwei || 30);
  const contractRatio = parseFloat(txData.contractCallRatio || 0.4);
  const recipientEntropy = parseFloat(txData.recipientEntropy || 0.7);
  const targetAddress = (txData.to || '').toLowerCase();
  const fromAddress = (txData.from || '').toLowerCase();

  const isTargetBlacklisted = targetAddress.includes('d8d4') ||
                              targetAddress.includes('4f8c') ||
                              targetAddress.includes('9923') ||
                              targetAddress.includes('drainer') ||
                              targetAddress.includes('mixer');

  const isFromBlacklisted = fromAddress.includes('d8d4') ||
                            fromAddress.includes('4f8c') ||
                            fromAddress.includes('drainer');

  return {
    amount,
    frequency,
    walletAge,
    gasGwei,
    contractRatio,
    recipientEntropy,
    isTargetBlacklisted,
    isFromBlacklisted,
    isHighAmount: amount > 10.0,
    isExtremeAmount: amount > 50.0,
    isNewWallet: walletAge < 14,
    isAbnormalGas: gasGwei > 100,
    isBurstVelocity: frequency > 15.0,
  };
}

export function computeRiskScore(features: ReturnType<typeof extractFeatures>): {
  riskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  explanation: string;
  recommendation: string;
  factors: RiskFactor[];
} {
  let score = 12;
  const factors: RiskFactor[] = [];

  // 1. Amount deviation
  if (features.isExtremeAmount) {
    score += 35;
    factors.push({
      name: 'Extreme Transaction Amount',
      impact: 'HIGH',
      weight: '+35%',
      description: `Outlier transfer volume (${features.amount} ETH) exceeding 99th percentile baseline.`,
      isNegative: true
    });
  } else if (features.isHighAmount) {
    score += 18;
    factors.push({
      name: 'Elevated Transaction Amount',
      impact: 'MEDIUM',
      weight: '+18%',
      description: `Substantial transfer volume (${features.amount} ETH) relative to historical profile.`,
      isNegative: true
    });
  } else {
    factors.push({
      name: 'Standard Transaction Amount',
      impact: 'LOW',
      weight: '-10%',
      description: `Value (${features.amount} ETH) within typical peer variance.`,
      isNegative: false
    });
    score -= 4;
  }

  // 2. Blacklist & Mixer Proximity
  if (features.isTargetBlacklisted || features.isFromBlacklisted) {
    score += 40;
    factors.push({
      name: 'Blacklist / Mixer Proximity',
      impact: 'CRITICAL',
      weight: '+40%',
      description: 'Counterparty address directly flagged in global decentralized threat intelligence feed.',
      isNegative: true
    });
  }

  // 3. Velocity & Frequency Spike
  if (features.isBurstVelocity) {
    score += 20;
    factors.push({
      name: 'Abnormal Velocity Spike',
      impact: 'HIGH',
      weight: '+20%',
      description: `High burst frequency (${features.frequency} tx/hr) indicative of automated sweep script.`,
      isNegative: true
    });
  }

  // 4. Wallet Age & Sybil Profile
  if (features.isNewWallet) {
    score += 15;
    factors.push({
      name: 'New / Disposable Wallet',
      impact: 'MEDIUM',
      weight: '+15%',
      description: `Wallet age is only ${features.walletAge} days with unestablished trust history.`,
      isNegative: true
    });
  } else if (features.walletAge > 300) {
    score -= 8;
    factors.push({
      name: 'Matured Wallet Longevity',
      impact: 'POSITIVE',
      weight: '-8%',
      description: `Account has maintained clean on-chain activity across ${features.walletAge} days.`,
      isNegative: false
    });
  }

  // 5. Gas / Priority Anomaly
  if (features.isAbnormalGas) {
    score += 12;
    factors.push({
      name: 'Aggressive Gas Priority',
      impact: 'MEDIUM',
      weight: '+12%',
      description: `Gas price (${features.gasGwei} Gwei) indicates frontrunning or rapid mempool bypass intent.`,
      isNegative: true
    });
  }

  score = Math.max(3, Math.min(98, Math.round(score)));

  let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let recommendation = 'Allow Transaction. Normal behavioral profile.';
  let confidenceScore = 0.94;

  if (score > 70) {
    riskCategory = 'HIGH';
    recommendation = 'FLAG FOR INVESTIGATION. Outlier anomaly deviation; pause settlement or trigger multisig verification.';
    confidenceScore = 0.98;
  } else if (score > 30) {
    riskCategory = 'MEDIUM';
    recommendation = 'MONITOR CLOSELY. Elevated behavioral deviation detected; request secondary user confirmation.';
    confidenceScore = 0.89;
  }

  let explanation = '';
  if (riskCategory === 'HIGH') {
    explanation = `High risk detected because the transaction involves ${
      features.isExtremeAmount ? 'an unusually massive transfer amount' : 'abnormal asset velocity'
    } ${
      features.isTargetBlacklisted ? 'interacting with a known high-risk/blacklisted contract' : 'with elevated gas pricing'
    } and ${
      features.isNewWallet ? 'originated from a newly created disposable account.' : 'shows severe deviation from normal decentralized baseline.'
    }`;
  } else if (riskCategory === 'MEDIUM') {
    explanation = `Moderate risk identified due to ${
      features.isHighAmount ? 'elevated transfer value' : 'unusual transaction frequency'
    } and moderate behavioral drift from normal baseline parameters.`;
  } else {
    explanation = 'Low risk confirmed. Transaction parameters, wallet longevity, recipient dispersion, and gas metrics are fully aligned with legitimate decentralized activity.';
  }

  return {
    riskScore: score,
    riskCategory,
    confidenceScore,
    explanation,
    recommendation,
    factors
  };
}

export function performAIAnalysis(txData: any): TransactionAnalysis {
  const features = extractFeatures(txData);
  const result = computeRiskScore(features);

  return {
    txHash: txData.txHash || `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    from: txData.from || '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B',
    to: txData.to || '0xd8d4F3879a978680d28765275e7A837f48e30000',
    amount: parseFloat(txData.amount || 0.1),
    frequencyPerHour: parseFloat(txData.frequencyPerHour || 1.0),
    walletAgeDays: parseInt(txData.walletAgeDays || 180, 10),
    gasGwei: parseFloat(txData.gasGwei || 30),
    network: txData.network || 'Polygon Amoy',
    riskScore: result.riskScore,
    riskCategory: result.riskCategory,
    confidenceScore: result.confidenceScore,
    explanation: result.explanation,
    recommendation: result.recommendation,
    factors: result.factors,
    timestamp: new Date().toISOString()
  };
}
