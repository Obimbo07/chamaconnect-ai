import type { Chama, Transaction } from '@/lib/mockData';

// Generate mock blockchain transaction hash
export const generateMockTxHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash + '...';
};

// Issue shares to a member
export const issueShares = (
  chama: Chama,
  memberId: string,
  sharesToIssue: number
): Chama => {
  const updatedChama = JSON.parse(JSON.stringify(chama)) as Chama;
  const nominalValue = updatedChama.shareCapital.nominalValuePerShare;
  const shareValue = sharesToIssue * nominalValue;

  // Find and update member shares
  const memberIndex = updatedChama.shareCapital.members.findIndex(
    (m) => m.memberId === memberId
  );

  if (memberIndex !== -1) {
    updatedChama.shareCapital.members[memberIndex].sharesHeld += sharesToIssue;
    updatedChama.shareCapital.members[memberIndex].shareValue +=
      shareValue;
  }

  // Update total issued shares
  updatedChama.shareCapital.totalIssuedShares += sharesToIssue;
  updatedChama.shareCapital.totalValue = calculateTotalShareValue(
    updatedChama.shareCapital
  );

  // Recalculate ownership percentages
  recalculateOwnership(updatedChama.shareCapital);

  // Add transaction to ledger
  const txHash = generateMockTxHash();
  const transaction: Transaction = {
    id: `tx-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    type: 'contribution',
    amount: shareValue,
    memberId,
    description: `Share issuance: ${sharesToIssue} shares @ Ksh ${nominalValue}`,
    blockchainTxHash: txHash,
  };

  updatedChama.transactions.push(transaction);

  // Add to blockchain ledger
  const memberName = getMemberName(memberId);
  updatedChama.blockchainLedger.push({
    txHash,
    timestamp: new Date().toISOString(),
    action: 'Share Issuance',
    details: `${memberName} issued ${sharesToIssue} shares (Ksh ${shareValue})`,
  });

  return updatedChama;
};

// Calculate utilization percentage
export const calculateUtilization = (chama: Chama): number => {
  if (chama.shareCapital.totalIssuedShares === 0) return 0;
  // Assuming max capacity is 10,000 shares per chama
  const maxCapacity = 10000;
  return Math.round(
    (chama.shareCapital.totalIssuedShares / maxCapacity) * 100
  );
};

// Calculate member ownership percentage
export const calculateOwnership = (
  chama: Chama,
  memberId: string
): number => {
  const member = chama.shareCapital.members.find(
    (m) => m.memberId === memberId
  );
  if (!member || chama.shareCapital.totalIssuedShares === 0) return 0;
  return (member.sharesHeld / chama.shareCapital.totalIssuedShares) * 100;
};

// Project dividends for a member
export const projectDividends = (
  chama: Chama,
  memberId: string,
  profitMargin: number = 0.1
): number => {
  const member = chama.shareCapital.members.find(
    (m) => m.memberId === memberId
  );
  if (!member) return 0;

  const ownership = calculateOwnership(chama, memberId);
  const totalValue = chama.shareCapital.totalValue;
  const projectedProfit = totalValue * profitMargin;

  return (ownership / 100) * projectedProfit;
};

// Helper: calculate total share value
const calculateTotalShareValue = (
  shareCapital: Chama['shareCapital']
): number => {
  return (
    shareCapital.totalIssuedShares *
    shareCapital.nominalValuePerShare
  );
};

// Helper: recalculate ownership percentages
const recalculateOwnership = (
  shareCapital: Chama['shareCapital']
): void => {
  const total = shareCapital.totalIssuedShares;
  if (total === 0) {
    shareCapital.members.forEach((m) => {
      m.ownershipPercent = 0;
    });
  } else {
    shareCapital.members.forEach((m) => {
      m.ownershipPercent = Number(
        ((m.sharesHeld / total) * 100).toFixed(1)
      );
    });
  }
  shareCapital.utilizationPercent = Math.round(
    (total / 10000) * 100
  );
};

// Helper: get member name from mockData
const getMemberName = (memberId: string): string => {
  const userNames: { [key: string]: string } = {
    u1: 'Austin Obimbo',
    u2: 'John Doe',
    u3: 'Jane Wanjiku',
    u4: 'Peter Ochieng',
    u5: 'Mary Akinyi',
    u6: 'Corporate Member A',
    u7: 'David Kipchoge',
    u8: 'Sarah Mwangi',
    u9: 'James Kiplagat',
  };
  return userNames[memberId] || `Member ${memberId}`;
};

// Calculate member's total savings
export const calculateMemberSavings = (
  chama: Chama,
  memberId: string
): number => {
  return chama.transactions
    .filter(
      (t) =>
        t.memberId === memberId &&
        (t.type === 'contribution' || t.type === 'dividend')
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate member's outstanding loans
export const calculateMemberLoans = (
  chama: Chama,
  memberId: string
): number => {
  const loansIssued = chama.transactions
    .filter((t) => t.memberId === memberId && t.type === 'loan')
    .reduce((sum, t) => sum + t.amount, 0);

  const repayments = chama.transactions
    .filter((t) => t.memberId === memberId && t.type === 'repayment')
    .reduce((sum, t) => sum + t.amount, 0);

  return Math.max(0, loansIssued - repayments);
};
