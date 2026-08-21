import express from 'express';
import cors from 'cors';
import { analyzeTransaction } from './aiEngine.js';
import { uploadToIPFS, getIPFSEvidence, getAllIPFSEvidence } from './ipfsService.js';
import { recordDAOFeedback, retrainModel, getFeedbackData } from './feedbackLoop.js';
import { INITIAL_WALLETS, INITIAL_REPORTS, SAMPLE_MEMPOOL_TRANSACTIONS, KNOWN_BLACKLIST } from './mockData.js';
import {
  scanSmartContract,
  PRESET_CONTRACTS,
  analyzeHoneypot,
  PRESET_HONEYPOT_TOKENS,
  MOCK_WALLET_ALLOWANCES,
  GLOBAL_THREAT_FEEDS
} from './securityEngine.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory application state for server runtime
let wallets = { ...INITIAL_WALLETS };
let reports = [...INITIAL_REPORTS];
let mempoolFeed = [...SAMPLE_MEMPOOL_TRANSACTIONS];

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'AI FraudShield',
    network: 'Polygon Amoy & Ethereum Sepolia Testnets',
    aiEngine: 'Online (Ensemble v2.4)',
    timestamp: new Date().toISOString()
  });
});

// Analyze Transaction (AI Engine)
app.post('/api/analyze', (req, res) => {
  const txData = req.body;
  const analysis = analyzeTransaction(txData);

  // Add to live mempool feed
  const newFeedItem = {
    txHash: txData.txHash || `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    from: txData.from || '0x71C8...a49B',
    to: txData.to || '0xd8d4...0000',
    amount: `${txData.amount || 0.1} ETH`,
    amountValue: parseFloat(txData.amount || 0.1),
    riskScore: analysis.riskScore,
    status: analysis.riskCategory === 'HIGH' ? 'Critical Alert' : (analysis.riskCategory === 'MEDIUM' ? 'Suspicious' : 'Clean'),
    timestamp: 'Just now',
    type: analysis.riskCategory === 'HIGH' ? 'High-Risk Transfer' : 'Standard Transfer',
    gasGwei: txData.gasGwei || 35
  };

  mempoolFeed.unshift(newFeedItem);
  if (mempoolFeed.length > 50) mempoolFeed.pop();

  res.json(analysis);
});

// Get Global Statistics
app.get('/api/stats', (req, res) => {
  const totalAnalyzed = 142980;
  const suspiciousCount = reports.filter(r => r.aiRiskScore > 30).length + 420;
  const verifiedFraudCount = reports.filter(r => r.status === 'Verified').length + 86;
  const protectedWallets = 12450;
  const avgRiskScore = 32.4;
  const aiAccuracy = 96.4;

  res.json({
    totalAnalyzed,
    suspiciousCount,
    verifiedFraudCount,
    protectedWallets,
    avgRiskScore,
    aiAccuracy,
    activeValidators: 9,
    ipfsPins: 1840,
    recentReports: reports
  });
});

// Wallet Profiles & Reputation
app.get('/api/wallets/:address', (req, res) => {
  const address = req.params.address.toLowerCase();
  const found = Object.values(wallets).find(w => w.address.toLowerCase() === address);

  if (found) {
    return res.json(found);
  }

  // Generate dynamic profile if address is new
  const isSuspicious = address.includes('d8d4') || address.includes('4f8c');
  const defaultProfile = {
    address: req.params.address,
    label: isSuspicious ? 'Suspicious Flagged Address' : 'Active Web3 Wallet',
    role: isSuspicious ? 'Flagged' : 'User',
    reputationScore: isSuspicious ? 18 : 88,
    riskLevel: isSuspicious ? 'HIGH' : 'LOW',
    totalAnalyzedTx: isSuspicious ? 12 : 45,
    verifiedFraudReports: isSuspicious ? 3 : 0,
    falseReports: 0,
    lastActivity: '15 mins ago',
    walletAgeDays: isSuspicious ? 6 : 240,
    behavioralMetrics: {
      avgAmountEth: isSuspicious ? 22.4 : 0.8,
      frequencyPerHour: isSuspicious ? 18.0 : 1.5,
      gasAnomalyIndex: isSuspicious ? 0.85 : 0.08,
      mixerProximity: isSuspicious ? 0.9 : 0.0,
      contractCallRatio: 0.5,
      recipientEntropy: 0.8
    }
  };

  wallets[req.params.address] = defaultProfile;
  res.json(defaultProfile);
});

// Get All Wallets
app.get('/api/wallets', (req, res) => {
  res.json(Object.values(wallets));
});

// Reports Management
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const { targetWallet, txHash, network, amountEth, aiRiskScore, aiDiagnosisSummary, ipfsEvidenceCID, evidenceTitle, reporter } = req.body;

  const newReport = {
    reportId: reports.length + 101,
    targetWallet,
    txHash: txHash || `0x${Math.random().toString(16).substring(2, 66)}`,
    network: network || 'Polygon Amoy',
    amountEth: parseFloat(amountEth || 10),
    aiRiskScore: parseInt(aiRiskScore || 85, 10),
    aiDiagnosisSummary: aiDiagnosisSummary || 'Suspicious high-risk anomaly detected by AI FraudShield.',
    riskCategory: aiRiskScore > 70 ? 'CRITICAL_DRAIN' : 'SUSPICIOUS_ROUTING',
    ipfsEvidenceCID: ipfsEvidenceCID || 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    evidenceTitle: evidenceTitle || 'Forensic Investigation Artifact',
    evidenceType: 'application/json',
    evidenceFileSize: '96.4 KB',
    reporter: reporter || '0x3A289bFE26A18d9633e79e65839C726f16E491eE',
    reporterRole: 'Security Investigator',
    timestamp: Date.now(),
    status: 'Voting',
    yesVotes: 1,
    noVotes: 0,
    requiredQuorum: 3,
    isResolved: false,
    aiConfidence: 0.96
  };

  reports.unshift(newReport);
  res.json({ success: true, report: newReport });
});

// DAO Validator Voting
app.post('/api/vote', (req, res) => {
  const { reportId, supportFraud, validatorAddress } = req.body;
  const report = reports.find(r => r.reportId === parseInt(reportId, 10));

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  if (supportFraud) {
    report.yesVotes += 1;
  } else {
    report.noVotes += 1;
  }

  // Check Quorum
  if (report.yesVotes + report.noVotes >= report.requiredQuorum) {
    report.isResolved = true;
    report.status = report.yesVotes > report.noVotes ? 'Verified' : 'Rejected';

    // Update target wallet reputation
    const target = wallets[report.targetWallet];
    if (target) {
      if (report.status === 'Verified') {
        target.reputationScore = Math.max(5, target.reputationScore - 45);
        target.verifiedFraudReports += 1;
        target.riskLevel = 'HIGH';
      } else {
        target.reputationScore = Math.min(100, target.reputationScore + 5);
      }
    }

    // Record into AI Feedback Loop
    recordDAOFeedback(
      report.reportId,
      report.txHash,
      report.aiRiskScore,
      report.status === 'Verified',
      { yes: report.yesVotes, no: report.noVotes }
    );
  }

  res.json({
    success: true,
    report,
    message: report.isResolved
      ? `Quorum reached. Case has been permanently resolved as ${report.status}. Wallet reputation updated.`
      : 'Validator vote recorded on-chain.'
  });
});

// IPFS Upload & Storage
app.post('/api/ipfs/upload', (req, res) => {
  const evidencePayload = req.body;
  const result = uploadToIPFS(evidencePayload);
  res.json(result);
});

app.get('/api/ipfs/evidence/:cid', (req, res) => {
  const evidence = getIPFSEvidence(req.params.cid);
  if (!evidence) {
    return res.status(404).json({ error: 'IPFS evidence CID not found' });
  }
  res.json(evidence);
});

app.get('/api/ipfs/all', (req, res) => {
  res.json(getAllIPFSEvidence());
});

// AI Model Feedback & Retraining
app.get('/api/feedback', (req, res) => {
  res.json(getFeedbackData());
});

app.post('/api/feedback/retrain', (req, res) => {
  const retrainResult = retrainModel();
  res.json(retrainResult);
});

// Mempool Live Stream Feed
app.get('/api/mempool', (req, res) => {
  res.json(mempoolFeed);
});

// --- WEB3 SECURITY SUITE ROUTES ---

// 1. Smart Contract Vulnerability Scanner
app.get('/api/security/contract-presets', (req, res) => {
  res.json(PRESET_CONTRACTS);
});

app.post('/api/security/scan-contract', (req, res) => {
  const { code, name } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Solidity code payload required' });
  }
  const result = scanSmartContract(code, name);
  res.json(result);
});

// 2. Token Honeypot & Phishing Detector
app.get('/api/security/honeypot-presets', (req, res) => {
  res.json(PRESET_HONEYPOT_TOKENS);
});

app.post('/api/security/honeypot-check', (req, res) => {
  const { address, name, symbol, network } = req.body;
  const result = analyzeHoneypot(address, { name, symbol, network });
  res.json(result);
});

// 3. Wallet Allowance Guardian & Revoke
let walletAllowances = { ...MOCK_WALLET_ALLOWANCES };

app.get('/api/security/allowances/:address', (req, res) => {
  const address = req.params.address.toLowerCase();
  const list = walletAllowances[address] || walletAllowances['default'];
  res.json({
    walletAddress: req.params.address,
    totalAllowances: list.length,
    criticalRisks: list.filter(a => a.riskLevel === 'CRITICAL').length,
    highRisks: list.filter(a => a.riskLevel === 'HIGH').length,
    allowances: list
  });
});

app.post('/api/security/revoke', (req, res) => {
  const { walletAddress, allowanceId, revokeAll } = req.body;
  const key = (walletAddress || 'default').toLowerCase();
  const currentList = walletAllowances[key] || [...walletAllowances['default']];

  if (revokeAll) {
    walletAllowances[key] = currentList.filter(a => a.riskLevel === 'SAFE');
  } else if (allowanceId) {
    walletAllowances[key] = currentList.filter(a => a.id !== allowanceId);
  }

  res.json({
    success: true,
    message: revokeAll ? 'All high-risk approvals revoked on-chain.' : 'Allowance revoked successfully.',
    remainingCount: (walletAllowances[key] || []).length
  });
});

// 4. Global Threat Radar & SIEM Telemetry
let threatFeeds = [...GLOBAL_THREAT_FEEDS];

app.get('/api/security/threat-radar', (req, res) => {
  res.json({
    defconLevel: 2,
    threatIndex: 'ELEVATED_RISK',
    activeExploits24h: 14,
    savedValueEstimate: '$3,890,000',
    topAttackedChains: ['Polygon Amoy', 'Ethereum Sepolia', 'Arbitrum One', 'BNB Chain'],
    threats: threatFeeds
  });
});

app.post('/api/security/broadcast-threat', (req, res) => {
  const newThreat = {
    id: `THREAT-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: 'Just now',
    type: req.body.type || 'Zero-Day Contract Exploit',
    network: req.body.network || 'Polygon Amoy',
    targetProtocol: req.body.targetProtocol || 'Flagged Smart Contract',
    lossEstimate: req.body.lossEstimate || '$0 (Mitigated)',
    attackerAddress: req.body.attackerAddress || '0x000000000000000000000000000000000000dead',
    status: 'DAO_ALERT_BROADCAST',
    severity: req.body.severity || 'HIGH',
    vector: req.body.vector || 'Broadcasted by Security Validator through AI FraudShield SIEM.'
  };

  threatFeeds.unshift(newThreat);
  if (threatFeeds.length > 50) threatFeeds.pop();

  res.json({ success: true, threat: newThreat });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 AI FraudShield API Gateway & AI Engine running on http://localhost:${PORT}`);
});
