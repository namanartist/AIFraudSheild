import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FraudReport,
  MempoolTransaction,
  IPFSEvidenceRecord,
  FeedbackMetrics,
  NotificationItem,
  TransactionAnalysis,
  WalletProfile
} from '../types';
import { performAIAnalysis } from '../utils/aiModels';
import { createPseudoCID } from '../utils/ipfs';
import { INITIAL_WALLETS, INITIAL_REPORTS, SAMPLE_MEMPOOL_TRANSACTIONS } from '../../server/mockData';

interface FraudShieldContextType {
  reports: FraudReport[];
  wallets: Record<string, WalletProfile>;
  mempool: MempoolTransaction[];
  evidenceStore: IPFSEvidenceRecord[];
  feedbackMetrics: FeedbackMetrics;
  feedbackDataset: any[];
  notifications: NotificationItem[];
  currentAnalysis: TransactionAnalysis | null;
  isAnalyzing: boolean;
  activeDemoStep: number | null;
  analyzeTx: (txData: any) => Promise<TransactionAnalysis>;
  submitInvestigationReport: (reportData: {
    targetWallet: string;
    txHash: string;
    amountEth: number;
    aiRiskScore: number;
    aiDiagnosisSummary: string;
    evidenceTitle: string;
    evidenceNotes: string;
    reporter: string;
    network?: string;
  }) => Promise<FraudReport>;
  castDAOVote: (reportId: number, supportFraud: boolean, validatorAddress: string) => Promise<void>;
  triggerModelRetrain: () => Promise<{ accuracyGain: string; fpReduction: string; updatedMetrics: FeedbackMetrics }>;
  getWalletProfile: (address: string) => WalletProfile;
  addNotification: (title: string, message: string, type?: 'alert' | 'success' | 'info' | 'warning', link?: string) => void;
  runDemoScenario: (scenarioType: 'NORMAL' | 'SUSPICIOUS' | 'FRAUD') => Promise<void>;
  clearActiveDemoStep: () => void;
}

const FraudShieldContext = createContext<FraudShieldContextType | undefined>(undefined);

export const FraudShieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<FraudReport[]>(INITIAL_REPORTS as any);
  const [wallets, setWallets] = useState<Record<string, WalletProfile>>(INITIAL_WALLETS as any);
  const [mempool, setMempool] = useState<MempoolTransaction[]>(SAMPLE_MEMPOOL_TRANSACTIONS as any);
  const [evidenceStore, setEvidenceStore] = useState<IPFSEvidenceRecord[]>([
    {
      cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
      title: 'Inferno Phishing Batch Analysis Dossier',
      targetWallet: '0xd8d4F3879a978680d28765275e7A837f48e30000',
      txHash: '0x9a8f21e5b8d774a1239bc7a9e01f5682910fae13d987e914cb2990aa415c8921',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      fileType: 'application/json',
      size: '142.8 KB',
      evidenceData: {
        investigatorNotes: 'Automated drainer script targeting Uniswap Permit2 allowance.',
        mixerInteraction: true,
        riskScore: 94
      },
      gatewayUrls: [
        'https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        'https://gateway.pinata.cloud/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
      ]
    }
  ]);

  const [feedbackMetrics, setFeedbackMetrics] = useState<FeedbackMetrics>({
    modelName: 'FraudShield Ensemble (IsolationForest v2.4 + XGBoost)',
    accuracy: 96.4,
    f1Score: 0.958,
    rocAuc: 0.984,
    falsePositiveRate: 2.1,
    totalVerifiedFeedbackSamples: 1420,
    lastRetrained: '2 hours ago',
    featureImportance: [
      { feature: 'Blacklist / Mixer Proximity', importance: 0.38 },
      { feature: 'Transaction Velocity Spike', importance: 0.24 },
      { feature: 'Outlier Transfer Amount', importance: 0.19 },
      { feature: 'Wallet Age / Sybil Score', importance: 0.11 },
      { feature: 'Gas Priority Deviation', importance: 0.08 }
    ]
  });

  const [feedbackDataset, setFeedbackDataset] = useState<any[]>([
    {
      caseId: 100,
      txHash: '0x7b10293847561029384756a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
      initialAiScore: 98,
      daoVerdict: 'VERIFIED_FRAUD',
      consensusRatio: '4/4 (100%)',
      verifiedTimestamp: 'Yesterday'
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Critical Threat Intercepted',
      message: 'AI flagged Whale Drainer transfer (85 ETH) to blacklisted smart contract.',
      type: 'alert',
      timestamp: '2 mins ago',
      read: false,
      link: '/investigation'
    },
    {
      id: '2',
      title: 'DAO Voting Session Active',
      message: 'Case #101 requires 1 additional validator vote to reach final quorum.',
      type: 'info',
      timestamp: '15 mins ago',
      read: false,
      link: '/dao'
    }
  ]);

  const [currentAnalysis, setCurrentAnalysis] = useState<TransactionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeDemoStep, setActiveDemoStep] = useState<number | null>(null);

  // Background live mempool simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      const isAnomalous = Math.random() > 0.65;
      const amount = isAnomalous ? (Math.random() * 45 + 5).toFixed(2) : (Math.random() * 1.5 + 0.05).toFixed(2);
      const risk = isAnomalous ? Math.floor(Math.random() * 40 + 55) : Math.floor(Math.random() * 25 + 5);

      const newTx: MempoolTransaction = {
        txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        from: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        to: isAnomalous ? '0xd8d4...0000' : `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        amount: `${amount} ETH`,
        amountValue: parseFloat(amount),
        riskScore: risk,
        status: risk > 70 ? 'Critical Alert' : (risk > 30 ? 'Suspicious' : 'Clean'),
        timestamp: 'Just now',
        type: isAnomalous ? (risk > 70 ? 'Whale Drain Spike' : 'Mixer Router Inflow') : 'DEX Transfer',
        gasGwei: isAnomalous ? Math.floor(Math.random() * 120 + 60) : Math.floor(Math.random() * 25 + 20)
      };

      setMempool(prev => [newTx, ...prev.slice(0, 35)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (title: string, message: string, type: 'alert' | 'success' | 'info' | 'warning' = 'info', link?: string) => {
    const newItem: NotificationItem = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      link
    };
    setNotifications(prev => [newItem, ...prev.slice(0, 15)]);
  };

  const analyzeTx = async (txData: any): Promise<TransactionAnalysis> => {
    setIsAnalyzing(true);
    // Simulate AI neural network latency
    await new Promise(r => setTimeout(r, 650));
    const result = performAIAnalysis(txData);
    setCurrentAnalysis(result);
    setIsAnalyzing(false);

    if (result.riskCategory === 'HIGH') {
      addNotification(
        'High-Risk Transaction Detected',
        `AI Risk Score ${result.riskScore}/100 on transfer of ${result.amount} ETH. Recommended: Flag for investigation.`,
        'alert',
        '/analyzer'
      );
    }
    return result;
  };

  const submitInvestigationReport = async (data: {
    targetWallet: string;
    txHash: string;
    amountEth: number;
    aiRiskScore: number;
    aiDiagnosisSummary: string;
    evidenceTitle: string;
    evidenceNotes: string;
    reporter: string;
    network?: string;
  }): Promise<FraudReport> => {
    const pseudoCID = createPseudoCID({
      targetWallet: data.targetWallet,
      txHash: data.txHash,
      notes: data.evidenceNotes,
      aiRiskScore: data.aiRiskScore,
      timestamp: Date.now()
    });

    const newEvidenceRecord: IPFSEvidenceRecord = {
      cid: pseudoCID,
      title: data.evidenceTitle || 'Forensic Evidence Bundle',
      targetWallet: data.targetWallet,
      txHash: data.txHash,
      timestamp: new Date().toISOString(),
      fileType: 'application/json',
      size: '118.4 KB',
      evidenceData: {
        investigatorNotes: data.evidenceNotes,
        aiScoreSnapshot: data.aiRiskScore,
        aiDiagnosis: data.aiDiagnosisSummary
      },
      gatewayUrls: [
        `https://ipfs.io/ipfs/${pseudoCID}`,
        `https://gateway.pinata.cloud/ipfs/${pseudoCID}`
      ]
    };

    setEvidenceStore(prev => [newEvidenceRecord, ...prev]);

    const newReport: FraudReport = {
      reportId: reports.length + 101,
      targetWallet: data.targetWallet,
      txHash: data.txHash,
      network: data.network || 'Polygon Amoy',
      amountEth: data.amountEth,
      aiRiskScore: data.aiRiskScore,
      aiDiagnosisSummary: data.aiDiagnosisSummary,
      riskCategory: data.aiRiskScore > 70 ? 'CRITICAL_DRAIN' : 'SUSPICIOUS_ROUTING',
      ipfsEvidenceCID: pseudoCID,
      evidenceTitle: data.evidenceTitle,
      evidenceType: 'application/json',
      evidenceFileSize: '118.4 KB',
      reporter: data.reporter,
      reporterRole: 'Security Investigator',
      timestamp: Date.now(),
      status: 'Voting',
      yesVotes: 1,
      noVotes: 0,
      requiredQuorum: 3,
      isResolved: false,
      aiConfidence: 0.97
    };

    setReports(prev => [newReport, ...prev]);

    addNotification(
      'Fraud Report Submitted & Pinned to IPFS',
      `Report #${newReport.reportId} recorded on-chain with IPFS CID ${pseudoCID.substring(0, 10)}...`,
      'info',
      '/dao'
    );

    return newReport;
  };

  const castDAOVote = async (reportId: number, supportFraud: boolean, validatorAddress: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.reportId === reportId) {
          const yes = supportFraud ? r.yesVotes + 1 : r.yesVotes;
          const no = !supportFraud ? r.noVotes + 1 : r.noVotes;
          const isQuorumReached = (yes + no) >= r.requiredQuorum;
          const resolvedStatus = isQuorumReached ? (yes > no ? 'Verified' : 'Rejected') : 'Voting';

          if (isQuorumReached) {
            // Update wallet reputation
            setWallets(wPrev => {
              const target = wPrev[r.targetWallet];
              if (target) {
                const newScore = resolvedStatus === 'Verified' ? Math.max(5, target.reputationScore - 45) : Math.min(100, target.reputationScore + 5);
                return {
                  ...wPrev,
                  [r.targetWallet]: {
                    ...target,
                    reputationScore: newScore,
                    verifiedFraudReports: resolvedStatus === 'Verified' ? target.verifiedFraudReports + 1 : target.verifiedFraudReports,
                    riskLevel: newScore < 30 ? 'HIGH' : (newScore < 70 ? 'MEDIUM' : 'LOW')
                  }
                };
              }
              return wPrev;
            });

            // Add to AI Feedback Dataset
            setFeedbackDataset(fPrev => [
              {
                caseId: r.reportId,
                txHash: r.txHash,
                initialAiScore: r.aiRiskScore,
                daoVerdict: resolvedStatus === 'Verified' ? 'VERIFIED_FRAUD' : 'FALSE_POSITIVE',
                consensusRatio: `${yes}/${yes + no}`,
                verifiedTimestamp: 'Just now'
              },
              ...fPrev
            ]);

            addNotification(
              `Case #${r.reportId} Resolved as ${resolvedStatus.toUpperCase()}`,
              `Consensus reached by DAO validators (${yes} YES / ${no} NO). Target wallet reputation updated.`,
              resolvedStatus === 'Verified' ? 'alert' : 'success',
              '/reputation'
            );
          } else {
            addNotification(
              'Validator Vote Cast',
              `Vote (${supportFraud ? 'VALID FRAUD' : 'FALSE POSITIVE'}) recorded on-chain. Current: ${yes} YES / ${no} NO.`,
              'info',
              '/dao'
            );
          }

          return {
            ...r,
            yesVotes: yes,
            noVotes: no,
            isResolved: isQuorumReached,
            status: resolvedStatus
          };
        }
        return r;
      })
    );
  };

  const triggerModelRetrain = async () => {
    const accuracyGain = (Math.random() * 0.35 + 0.15).toFixed(2);
    const fpReduction = (Math.random() * 0.25 + 0.1).toFixed(2);

    const updated: FeedbackMetrics = {
      ...feedbackMetrics,
      accuracy: Math.min(99.8, parseFloat((feedbackMetrics.accuracy + parseFloat(accuracyGain)).toFixed(2))),
      f1Score: Math.min(0.995, parseFloat((feedbackMetrics.f1Score + 0.002).toFixed(3))),
      rocAuc: Math.min(0.999, parseFloat((feedbackMetrics.rocAuc + 0.001).toFixed(3))),
      falsePositiveRate: Math.max(0.4, parseFloat((feedbackMetrics.falsePositiveRate - parseFloat(fpReduction)).toFixed(2))),
      totalVerifiedFeedbackSamples: feedbackMetrics.totalVerifiedFeedbackSamples + feedbackDataset.length,
      lastRetrained: 'Just now'
    };

    setFeedbackMetrics(updated);

    addNotification(
      'AI Feedback Loop Retraining Complete',
      `Model updated with DAO human-verified ground truths. Accuracy +${accuracyGain}%, False Positives -${fpReduction}%.`,
      'success',
      '/analytics'
    );

    return {
      accuracyGain: `+${accuracyGain}%`,
      fpReduction: `-${fpReduction}%`,
      updatedMetrics: updated
    };
  };

  const getWalletProfile = (address: string): WalletProfile => {
    const normalized = address.toLowerCase();
    const found = Object.values(wallets).find(w => w.address.toLowerCase() === normalized);
    if (found) return found;

    const isSuspicious = normalized.includes('d8d4') || normalized.includes('4f8c');
    return {
      address,
      label: isSuspicious ? 'Flagged Drainer Sybil' : 'Standard Web3 Account',
      role: isSuspicious ? 'Flagged' : 'User',
      reputationScore: isSuspicious ? 15 : 88,
      riskLevel: isSuspicious ? 'HIGH' : 'LOW',
      totalAnalyzedTx: isSuspicious ? 18 : 62,
      verifiedFraudReports: isSuspicious ? 5 : 0,
      falseReports: 0,
      lastActivity: '12 mins ago',
      walletAgeDays: isSuspicious ? 4 : 320,
      behavioralMetrics: {
        avgAmountEth: isSuspicious ? 34.0 : 0.65,
        frequencyPerHour: isSuspicious ? 22.0 : 1.1,
        gasAnomalyIndex: isSuspicious ? 0.92 : 0.04,
        mixerProximity: isSuspicious ? 0.85 : 0.0,
        contractCallRatio: 0.6,
        recipientEntropy: 0.85
      }
    };
  };

  const runDemoScenario = async (scenarioType: 'NORMAL' | 'SUSPICIOUS' | 'FRAUD') => {
    let txPayload: any;
    if (scenarioType === 'NORMAL') {
      txPayload = {
        txHash: '0x3344...8899',
        from: '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B',
        to: '0x1234567890123456789012345678901234567890',
        amount: 0.15,
        frequencyPerHour: 1.2,
        walletAgeDays: 450,
        gasGwei: 28,
        contractCallRatio: 0.2
      };
    } else if (scenarioType === 'SUSPICIOUS') {
      txPayload = {
        txHash: '0x77aa...1122',
        from: '0x71C8a91A9B9325603e9ff76f1F4fB40b8a21a49B',
        to: '0x4f8C9b218B82eA819283749281a812838183b912',
        amount: 14.8,
        frequencyPerHour: 18.5,
        walletAgeDays: 22,
        gasGwei: 85,
        contractCallRatio: 0.75
      };
    } else {
      txPayload = {
        txHash: '0x99ff...44aa',
        from: '0xd8d4F3879a978680d28765275e7A837f48e30000',
        to: '0x992384718293487192834719283471928347f7aa',
        amount: 88.5,
        frequencyPerHour: 48.0,
        walletAgeDays: 2,
        gasGwei: 195,
        contractCallRatio: 0.95
      };
    }

    // Step 1: Detect & Analyze
    setActiveDemoStep(1);
    await analyzeTx(txPayload);

    // Step 2: If high risk, auto-generate investigation dossier & IPFS proof
    if (scenarioType === 'FRAUD') {
      setActiveDemoStep(2);
      await new Promise(r => setTimeout(r, 900));

      setActiveDemoStep(3);
      await submitInvestigationReport({
        targetWallet: txPayload.from,
        txHash: txPayload.txHash,
        amountEth: txPayload.amount,
        aiRiskScore: 94,
        aiDiagnosisSummary: 'Automated Whale Drainer sweep with high mixer correlation and excessive gas priority.',
        evidenceTitle: 'Automated Forensics Sweep Artifact',
        evidenceNotes: 'Real-time detector captured unauthorized batch transfer to blacklisted siphon pool.',
        reporter: '0x3A289bFE26A18d9633e79e65839C726f16E491eE'
      });

      setActiveDemoStep(4);
    }
  };

  const clearActiveDemoStep = () => {
    setActiveDemoStep(null);
  };

  return (
    <FraudShieldContext.Provider
      value={{
        reports,
        wallets,
        mempool,
        evidenceStore,
        feedbackMetrics,
        feedbackDataset,
        notifications,
        currentAnalysis,
        isAnalyzing,
        activeDemoStep,
        analyzeTx,
        submitInvestigationReport,
        castDAOVote,
        triggerModelRetrain,
        getWalletProfile,
        addNotification,
        runDemoScenario,
        clearActiveDemoStep
      }}
    >
      {children}
    </FraudShieldContext.Provider>
  );
};

export const useFraudShield = () => {
  const context = useContext(FraudShieldContext);
  if (!context) {
    throw new Error('useFraudShield must be used within a FraudShieldProvider');
  }
  return context;
};
