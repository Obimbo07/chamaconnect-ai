import type { User, Chama, Transaction } from '@/lib/mockData';

export interface RAGContext {
  userProfile: string;
  chamaStatus: string;
  relevantTransactions: string;
  financialMetrics: string;
}

/**
 * RAG Pipeline: Retrieves and Augments context from mock data
 * This context is passed to the AI model for more informed responses
 */
export function buildRAGContext(
  message: string,
  user: User,
  chama: Chama
): RAGContext {
  return {
    userProfile: extractUserProfile(user, chama),
    chamaStatus: extractChamaStatus(chama),
    relevantTransactions: extractRelevantTransactions(message, user, chama),
    financialMetrics: extractFinancialMetrics(user, chama),
  };
}

/**
 * Extract user's current profile and status
 */
function extractUserProfile(user: User, chama: Chama): string {
  const member = chama.shareCapital.members.find((m) => m.memberId === user.id);
  const userTransactions = chama.transactions.filter((t) => t.memberId === user.id);
  const userFines = chama.fines.filter((f) => f.memberId === user.id);
  const totalContributions = chama.transactions
    .filter((t) => t.memberId === user.id && t.type === 'contribution')
    .reduce((sum, t) => sum + t.amount, 0);

  return `
User: ${user.name} (${user.role})
Email: ${user.email}
Phone: ${user.phone}
Current Shares: ${member?.sharesHeld || 0} worth KSh ${(member?.shareValue || 0).toLocaleString()}
Ownership: ${((member?.ownershipPercent || 0) * 100).toFixed(2)}%
Total Contributions: KSh ${totalContributions.toLocaleString()}
Active Loans: ${chama.transactions.filter((t) => t.memberId === user.id && t.type === 'loan').length}
Pending Fines: ${userFines.length} totaling KSh ${userFines.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
Recent Activity: ${userTransactions.length} transactions in last period
  `.trim();
}

/**
 * Extract overall chama/SACCO status
 */
function extractChamaStatus(chama: Chama): string {
  const totalValue = chama.shareCapital.totalValue;
  const activeLoans = chama.transactions.filter((t) => t.type === 'loan').length;
  const totalLoanValue = chama.transactions
    .filter((t) => t.type === 'loan')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalContributions = chama.transactions
    .filter((t) => t.type === 'contribution')
    .reduce((sum, t) => sum + t.amount, 0);

  return `
Chama: ${chama.name} (${chama.type})
Members: ${chama.membersCount}
Share Capital Value: KSh ${totalValue.toLocaleString()}
Utilization Rate: ${chama.shareCapital.utilizationPercent}%
Issued Shares: ${chama.shareCapital.totalIssuedShares} @ KSh ${chama.shareCapital.nominalValuePerShare.toLocaleString()} each
Active Loans: ${activeLoans} worth KSh ${totalLoanValue.toLocaleString()}
Total Contributions: KSh ${totalContributions.toLocaleString()}
Recent Transactions: ${chama.transactions.length} total
Blockchain Records: ${chama.blockchainLedger.length} entries
  `.trim();
}

/**
 * Extract relevant transactions based on query intent
 */
function extractRelevantTransactions(
  message: string,
  user: User,
  chama: Chama
): string {
  const messageLower = message.toLowerCase();
  let relevantTxs: Transaction[] = [];

  // Detect intent and fetch relevant transactions
  if (messageLower.includes('loan') || messageLower.includes('mikopo')) {
    relevantTxs = chama.transactions.filter(
      (t) => t.type === 'loan' && (t.memberId === user.id || !t.memberId)
    );
  } else if (messageLower.includes('contribution') || messageLower.includes('save')) {
    relevantTxs = chama.transactions.filter(
      (t) => t.type === 'contribution' && t.memberId === user.id
    );
  } else if (messageLower.includes('dividend') || messageLower.includes('profit')) {
    relevantTxs = chama.transactions.filter(
      (t) => t.type === 'dividend' && t.memberId === user.id
    );
  } else if (messageLower.includes('fine') || messageLower.includes('penalty')) {
    relevantTxs = chama.fines.filter((f) => f.memberId === user.id);
  } else {
    // Return last 5 transactions for general queries
    relevantTxs = chama.transactions.slice(-5);
  }

  if (relevantTxs.length === 0) {
    return 'No relevant recent transactions found.';
  }

  const txSummary = relevantTxs
    .map(
      (tx) =>
        `${tx.date}: ${tx.type.toUpperCase()} - KSh ${tx.amount.toLocaleString()} (${tx.description})`
    )
    .join('\n');

  return `Recent Relevant Transactions:\n${txSummary}`;
}

/**
 * Extract key financial metrics for analysis
 */
function extractFinancialMetrics(user: User, chama: Chama): string {
  const member = chama.shareCapital.members.find((m) => m.memberId === user.id);
  const userTransactions = chama.transactions.filter((t) => t.memberId === user.id);

  // Calculate average contribution
  const contributions = userTransactions
    .filter((t) => t.type === 'contribution')
    .map((t) => t.amount);
  const avgContribution =
    contributions.length > 0 ? contributions.reduce((a, b) => a + b, 0) / contributions.length : 0;

  // Calculate loan to contribution ratio
  const totalLoans = userTransactions
    .filter((t) => t.type === 'loan')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalContributions = userTransactions
    .filter((t) => t.type === 'contribution')
    .reduce((sum, t) => sum + t.amount, 0);

  // Projected growth
  const currentValue = member?.shareValue || 0;
  const monthlyProjection = (avgContribution * 12) / 1000; // Simplified projection

  return `
Financial Metrics for ${user.name}:
Average Monthly Contribution: KSh ${Math.round(avgContribution).toLocaleString()}
Total Loans Taken: KSh ${totalLoans.toLocaleString()}
Total Contributions: KSh ${totalContributions.toLocaleString()}
Loan-to-Contribution Ratio: ${(totalLoans / totalContributions || 0).toFixed(2)}
Current Portfolio Value: KSh ${currentValue.toLocaleString()}
Projected Annual Growth: KSh ${Math.round(monthlyProjection * 12).toLocaleString()} (at current rate)
Share Growth Potential: ${((member?.sharesHeld || 0) + Math.floor(monthlyProjection)).toLocaleString()} shares in 12 months
  `.trim();
}

/**
 * Format RAG context as a system prompt for the AI model
 */
export function formatRAGAsPrompt(ragContext: RAGContext, language: 'en' | 'sw'): string {
  const systemPrompt =
    language === 'sw'
      ? `Wewe ni AI Companion kwa ChamaAI, mnumba wa akshi za Kiafrika na vikundi vya kusambaza pesa. Tumia mafunzo haya kuangalia maswali:

${ragContext.userProfile}

${ragContext.chamaStatus}

${ragContext.relevantTransactions}

${ragContext.financialMetrics}

Useme mafunzo haya kutoa mashauri maalum, tahulufu zinazoambukizwa, na mapendekezo yenye manufaa. Jibu kwa Kiswahili.`
      : `You are the AI Companion for ChamaAI, supporting African savings groups and SACCOs. Use this context to answer questions:

${ragContext.userProfile}

${ragContext.chamaStatus}

${ragContext.relevantTransactions}

${ragContext.financialMetrics}

Use this context to provide personalized advice, data-backed recommendations, and actionable insights. Respond in English.`;

  return systemPrompt;
}

/**
 * Extract query intent for better retrieval
 */
export function detectQueryIntent(message: string): string[] {
  const intents: string[] = [];
  const messageLower = message.toLowerCase();

  if (messageLower.includes('share') || messageLower.includes('aksh'))
    intents.push('shares');
  if (messageLower.includes('loan') || messageLower.includes('mikopo'))
    intents.push('loans');
  if (messageLower.includes('save') || messageLower.includes('contribu'))
    intents.push('contributions');
  if (messageLower.includes('fine') || messageLower.includes('penalty') || messageLower.includes('mgogoro'))
    intents.push('fines');
  if (messageLower.includes('dividend') || messageLower.includes('profit'))
    intents.push('dividends');
  if (messageLower.includes('status') || messageLower.includes('hali'))
    intents.push('status');

  return intents.length > 0 ? intents : ['general'];
}
