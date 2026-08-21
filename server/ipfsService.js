import crypto from 'crypto';

// In-memory decentralized evidence repository
const IPFS_STORE = new Map();

// Seed with initial evidence dossiers
IPFS_STORE.set('bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi', {
  cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  title: 'Inferno Phishing Batch Analysis Dossier',
  targetWallet: '0xd8d4F3879a978680d28765275e7A837f48e30000',
  txHash: '0x9a8f21e5b8d774a1239bc7a9e01f5682910fae13d987e914cb2990aa415c8921',
  timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  fileType: 'application/json',
  size: '142.8 KB',
  evidenceData: {
    investigatorNotes: 'Identified automated drainer payload calling setApprovalForAll on 18 victim wallets.',
    decompiledSignatures: ['0xa22ba947', '0x23b872dd'],
    mixerInteractionDetected: true,
    riskScoreAtTimeOfReport: 94
  }
});

/**
 * Generate a deterministic CIDv1 base32 multihash for payload
 */
export function generateIPFSCID(payload) {
  const dataString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const hash = crypto.createHash('sha256').update(dataString).digest('hex');
  // Format as standard IPFS CIDv1 prefix bafybei...
  const cid = 'bafybei' + hash.slice(0, 52);
  return cid;
}

/**
 * Upload evidence payload to IPFS storage
 */
export function uploadToIPFS(evidencePayload) {
  const cid = generateIPFSCID(evidencePayload);
  const record = {
    cid,
    title: evidencePayload.title || 'FraudShield Evidence Artifact',
    targetWallet: evidencePayload.targetWallet,
    txHash: evidencePayload.txHash,
    timestamp: new Date().toISOString(),
    fileType: evidencePayload.fileType || 'application/json',
    size: `${(JSON.stringify(evidencePayload).length / 1024).toFixed(1)} KB`,
    evidenceData: evidencePayload,
    gatewayUrls: [
      `https://ipfs.io/ipfs/${cid}`,
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      `https://dweb.link/ipfs/${cid}`
    ]
  };

  IPFS_STORE.set(cid, record);
  return record;
}

export function getIPFSEvidence(cid) {
  return IPFS_STORE.get(cid) || null;
}

export function getAllIPFSEvidence() {
  return Array.from(IPFS_STORE.values());
}
