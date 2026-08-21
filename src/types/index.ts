export type UserRole = 'User' | 'Investigator' | 'Validator' | 'Admin' | 'Flagged';

export interface WalletProfile {
  address: string;
  label: string;
  role: UserRole;
  reputationScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'TRUSTED';
  totalAnalyzedTx: number;
  verifiedFraudReports: number;
  falseReports: number;
  lastActivity: string;
  walletAgeDays: number;
  behavioralMetrics: {
    avgAmountEth: number;
    frequencyPerHour: number;
    gasAnomalyIndex: number;
    mixerProximity: number;
    contractCallRatio: number;
    recipientEntropy: number;
  };
}

export interface RiskFactor {
  name: string;
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'POSITIVE';
  weight: string;
  description: string;
  isNegative: boolean;
}

export interface TransactionAnalysis {
  txHash: string;
  from: string;
  to: string;
  amount: number;
  frequencyPerHour?: number;
  walletAgeDays?: number;
  gasGwei?: number;
  network?: string;
  riskScore: number; // 0 - 100
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  explanation: string;
  recommendation: string;
  factors: RiskFactor[];
  timestamp: string;
}

export interface FraudReport {
  reportId: number;
  targetWallet: string;
  txHash: string;
  network: string;
  amountEth: number;
  aiRiskScore: number;
  aiDiagnosisSummary: string;
  riskCategory: string;
  ipfsEvidenceCID: string;
  evidenceTitle: string;
  evidenceType: string;
  evidenceFileSize: string;
  reporter: string;
  reporterRole: string;
  timestamp: number;
  status: 'Submitted' | 'InReview' | 'Voting' | 'Verified' | 'Rejected';
  yesVotes: number;
  noVotes: number;
  requiredQuorum: number;
  isResolved: boolean;
  aiConfidence: number;
}

export interface MempoolTransaction {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  amountValue: number;
  riskScore: number;
  status: 'Clean' | 'Suspicious' | 'Flagged' | 'Critical Alert';
  timestamp: string;
  type: string;
  gasGwei: number;
}

export interface IPFSEvidenceRecord {
  cid: string;
  title: string;
  targetWallet: string;
  txHash: string;
  timestamp: string;
  fileType: string;
  size: string;
  evidenceData: any;
  gatewayUrls: string[];
}

export interface FeedbackMetrics {
  modelName: string;
  accuracy: number;
  f1Score: number;
  rocAuc: number;
  falsePositiveRate: number;
  totalVerifiedFeedbackSamples: number;
  lastRetrained: string;
  featureImportance: { feature: string; importance: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
  link?: string;
}
