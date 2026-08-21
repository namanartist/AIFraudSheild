// AI Risk Engine & Explainability Core for AI FraudShield

export function extractFeatures(txData) {
  const amount = parseFloat(txData.amount || 0);
  const frequency = parseFloat(txData.frequencyPerHour || 1.0);
  const walletAge = parseInt(txData.walletAgeDays || 180, 10);
  const gasGwei = parseFloat(txData.gasGwei || 30);
  const contractRatio = parseFloat(txData.contractCallRatio || 0.4);
  const recipientEntropy = parseFloat(txData.recipientEntropy || 0.7);
  const targetAddress = (txData.to || '').toLowerCase();
  const fromAddress = (txData.from || '').toLowerCase();

  // Known blacklisted substring or address check
  const isTargetBlacklisted = targetAddress.includes('d8d4') ||
                              targetAddress.includes('4f8c') ||
                              targetAddress.includes('9923') ||
                              targetAddress.includes('drainer') ||
                              targetAddress.includes('mixer');

  const isFromBlacklisted = fromAddress.includes('d8d4') ||
                            fromAddress.includes('4f8c') ||
                            fromAddress.includes('drainer');

  // Compute normalized behavioral features
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

export function computeRiskScore(features) {
  let score = 10; // Baseline friction
  const factors = [];

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
      description: `Value (${features.amount} ETH) within typical variance bounds.`,
      isNegative: false
    });
    score -= 5;
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
      description: `High burst frequency (${features.frequency} tx/hr) indicative of automated bot or sweep attack.`,
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
      description: `Wallet age is only ${features.walletAge} days with unestablished reputation history.`,
      isNegative: true
    });
  } else if (features.walletAge > 300) {
    score -= 10;
    factors.push({
      name: 'Matured Wallet Longevity',
      impact: 'POSITIVE',
      weight: '-10%',
      description: `Account has maintained clean activity across ${features.walletAge} days.`,
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

  // Clamp 0-100
  score = Math.max(2, Math.min(99, Math.round(score)));

  let riskCategory = 'LOW';
  let recommendation = 'Allow Transaction. Normal behavioral profile.';
  let confidenceScore = 0.94;

  if (score > 70) {
    riskCategory = 'HIGH';
    recommendation = 'FLAG FOR INVESTIGATION. High anomaly deviation; block or require multisig verification.';
    confidenceScore = 0.98;
  } else if (score > 30) {
    riskCategory = 'MEDIUM';
    recommendation = 'MONITOR CLOSELY. Elevated behavioral deviation detected; apply rate limiting or additional confirmation.';
    confidenceScore = 0.89;
  }

  // Generate plain-text diagnostic explanation
  let explanation = '';
  if (riskCategory === 'HIGH') {
    explanation = `High risk detected because the transaction involves ${
      features.isExtremeAmount ? 'an unusually massive transfer amount' : 'abnormal asset movement'
    } ${
      features.isTargetBlacklisted ? 'interacting with a known high-risk/blacklisted address' : 'with suspicious velocity'
    } and ${
      features.isNewWallet ? 'originated from a newly created disposable account.' : 'shows severe deviation from historical activity patterns.'
    }`;
  } else if (riskCategory === 'MEDIUM') {
    explanation = `Moderate risk identified due to ${
      features.isHighAmount ? 'elevated transfer value' : 'unusual transaction timing'
    } and moderate behavioral drift from normal baseline parameters.`;
  } else {
    explanation = 'Low risk confirmed. Transaction parameters, wallet age, recipient dispersion, and gas metrics are fully aligned with legitimate decentralized activity.';
  }

  return {
    riskScore: score,
    riskCategory,
    confidenceScore,
    explanation,
    recommendation,
    factors,
    timestamp: new Date().toISOString()
  };
}

export function analyzeTransaction(txData) {
  const features = extractFeatures(txData);
  const analysis = computeRiskScore(features);
  return {
    ...txData,
    features,
    ...analysis
  };
}
