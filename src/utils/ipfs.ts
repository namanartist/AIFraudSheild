// Client-side IPFS utilities

export function createPseudoCID(payload: any): string {
  const str = JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0') +
              Date.now().toString(16) +
              Math.random().toString(16).substring(2, 10);
  return 'bafybei' + hex.padEnd(52, 'x').substring(0, 52);
}

export function formatCID(cid: string): string {
  if (!cid) return '';
  if (cid.length <= 16) return cid;
  return `${cid.substring(0, 8)}...${cid.substring(cid.length - 8)}`;
}

export function getIPFSGatewayUrl(cid: string, provider: 'ipfs.io' | 'pinata' | 'dweb' = 'ipfs.io'): string {
  switch (provider) {
    case 'pinata':
      return `https://gateway.pinata.cloud/ipfs/${cid}`;
    case 'dweb':
      return `https://dweb.link/ipfs/${cid}`;
    default:
      return `https://ipfs.io/ipfs/${cid}`;
  }
}
