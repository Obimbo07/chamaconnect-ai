export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // For demo login only
  phone: string;
  role: 'chairperson' | 'treasurer' | 'member';
  chamaId: string;
}

export interface ShareCapital {
  totalIssuedShares: number;
  nominalValuePerShare: number;
  totalValue: number;
  utilizationPercent: number;
  members: {
    memberId: string;
    sharesHeld: number;
    shareValue: number;
    ownershipPercent: number;
  }[];
}

export interface Transaction {
  id: string;
  date: string; // ISO date
  type: 'contribution' | 'loan' | 'repayment' | 'fine' | 'expense' | 'dividend';
  amount: number;
  memberId?: string;
  description: string;
  blockchainTxHash?: string; // Mock immutable record
}

export interface Chama {
  id: string;
  name: string;
  type: 'Chama' | 'SACCO';
  membersCount: number;
  shareCapital: ShareCapital;
  transactions: Transaction[];
  expenses: Transaction[]; // Subset of transactions for clarity
  fines: Transaction[]; // Subset for fines
  blockchainLedger: {
    txHash: string;
    timestamp: string;
    action: string;
    details: string;
  }[];
}

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Austin Obimbo',
    email: 'obimboausts@gmail.com',
    password: 's0ftware123##',
    phone: '+254 714 731 015',
    role: 'chairperson',
    chamaId: 'chama1',
  },
  {
    id: 'u2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'member123',
    phone: '+254 712 345 678',
    role: 'member',
    chamaId: 'chama1',
  },
  {
    id: 'u3',
    name: 'Jane Wanjiku',
    email: 'jane.wanjiku@example.com',
    password: 'member123',
    phone: '+254 711 987 654',
    role: 'treasurer',
    chamaId: 'chama1',
  },
  // Umoja SACCO users
  {
    id: 'u4',
    name: 'Peter Ochieng',
    email: 'peter.och@example.com',
    password: 'sacco123',
    phone: '+254 722 111 222',
    role: 'chairperson',
    chamaId: 'chama2',
  },
  {
    id: 'u5',
    name: 'Mary Akinyi',
    email: 'mary.akinyi@example.com',
    password: 'sacco123',
    phone: '+254 733 444 555',
    role: 'member',
    chamaId: 'chama2',
  },
];

export const mockChamas: Chama[] = [
  {
    id: 'chama1',
    name: 'Obimbo Chama',
    type: 'Chama',
    membersCount: 3,
    shareCapital: {
      totalIssuedShares: 0,
      nominalValuePerShare: 1000,
      totalValue: 0,
      utilizationPercent: 0,
      members: [
        {
          memberId: 'u1',
          sharesHeld: 0,
          shareValue: 0,
          ownershipPercent: 0,
        },
        {
          memberId: 'u2',
          sharesHeld: 0,
          shareValue: 0,
          ownershipPercent: 0,
        },
        {
          memberId: 'u3',
          sharesHeld: 0,
          shareValue: 0,
          ownershipPercent: 0,
        },
      ],
    },
    transactions: [
      {
        id: 't1',
        date: '2026-03-15',
        type: 'contribution',
        amount: 5000,
        memberId: 'u1',
        description: 'Monthly savings - Austin',
        blockchainTxHash: '0xabc123def456...',
      },
      {
        id: 't2',
        date: '2026-03-20',
        type: 'loan',
        amount: 15000,
        memberId: 'u2',
        description: 'Emergency loan - John Doe',
        blockchainTxHash: '0xdef456ghi789...',
      },
      {
        id: 't3',
        date: '2026-03-25',
        type: 'repayment',
        amount: 3000,
        memberId: 'u2',
        description: 'Loan repayment installment',
        blockchainTxHash: '0xghi789jkl012...',
      },
      {
        id: 't4',
        date: '2026-04-01',
        type: 'contribution',
        amount: 4500,
        memberId: 'u3',
        description: 'Monthly savings - Jane',
        blockchainTxHash: '0xjkl012mno345...',
      },
    ],
    expenses: [
      {
        id: 'e1',
        date: '2026-03-10',
        type: 'expense',
        amount: 2000,
        description: 'Chama meeting refreshments',
        blockchainTxHash: '0xmno345pqr678...',
      },
    ],
    fines: [
      {
        id: 'f1',
        date: '2026-03-18',
        type: 'fine',
        amount: 500,
        memberId: 'u3',
        description: 'Late contribution penalty - Jane Wanjiku',
        blockchainTxHash: '0xpqr678stu901...',
      },
    ],
    blockchainLedger: [
      {
        txHash: '0xabc123def456...',
        timestamp: '2026-03-15T10:00:00Z',
        action: 'Contribution',
        details: 'Austin Obimbo deposited KSh 5,000',
      },
      {
        txHash: '0xdef456ghi789...',
        timestamp: '2026-03-20T14:30:00Z',
        action: 'Loan Issued',
        details: 'John Doe received KSh 15,000 loan',
      },
      {
        txHash: '0xghi789jkl012...',
        timestamp: '2026-03-25T09:15:00Z',
        action: 'Loan Repayment',
        details: 'John Doe repaid KSh 3,000 towards loan',
      },
      {
        txHash: '0xjkl012mno345...',
        timestamp: '2026-04-01T11:20:00Z',
        action: 'Contribution',
        details: 'Jane Wanjiku deposited KSh 4,500',
      },
    ],
  },

  // Second chama - Umoja SACCO (larger & active to show scalability)
  {
    id: 'chama2',
    name: 'Umoja Investment SACCO',
    type: 'SACCO',
    membersCount: 12,
    shareCapital: {
      totalIssuedShares: 8500,
      nominalValuePerShare: 1000,
      totalValue: 8500000,
      utilizationPercent: 85,
      members: [
        {
          memberId: 'u4',
          sharesHeld: 2500,
          shareValue: 2500000,
          ownershipPercent: 29.4,
        },
        {
          memberId: 'u5',
          sharesHeld: 1200,
          shareValue: 1200000,
          ownershipPercent: 14.1,
        },
        {
          memberId: 'u6',
          sharesHeld: 1800,
          shareValue: 1800000,
          ownershipPercent: 21.2,
        },
        {
          memberId: 'u7',
          sharesHeld: 1000,
          shareValue: 1000000,
          ownershipPercent: 11.8,
        },
        {
          memberId: 'u8',
          sharesHeld: 500,
          shareValue: 500000,
          ownershipPercent: 5.9,
        },
        {
          memberId: 'u9',
          sharesHeld: 500,
          shareValue: 500000,
          ownershipPercent: 5.9,
        },
      ],
    },
    transactions: [
      {
        id: 't5',
        date: '2026-04-01',
        type: 'contribution',
        amount: 8000,
        memberId: 'u4',
        description: 'Monthly savings - Peter Ochieng',
        blockchainTxHash: '0xstu901vwx234...',
      },
      {
        id: 't6',
        date: '2026-03-28',
        type: 'dividend',
        amount: 45000,
        memberId: 'u4',
        description: 'Q1 Dividend payout',
        blockchainTxHash: '0xvwx234yza567...',
      },
      {
        id: 't7',
        date: '2026-04-03',
        type: 'loan',
        amount: 45000,
        memberId: 'u5',
        description: 'Business expansion loan',
        blockchainTxHash: '0xyza567bcd890...',
      },
      {
        id: 't8',
        date: '2026-03-30',
        type: 'contribution',
        amount: 12000,
        memberId: 'u6',
        description: 'Quarterly contribution - Business owner',
        blockchainTxHash: '0xbcd890efg123...',
      },
      {
        id: 't9',
        date: '2026-04-05',
        type: 'repayment',
        amount: 8000,
        memberId: 'u5',
        description: 'Loan repayment - monthly installment',
        blockchainTxHash: '0xefg123hij456...',
      },
    ],
    expenses: [
      {
        id: 'e2',
        date: '2026-03-30',
        type: 'expense',
        amount: 12000,
        description: 'SACCO office rent & utilities',
        blockchainTxHash: '0xhij456klm789...',
      },
      {
        id: 'e3',
        date: '2026-04-02',
        type: 'expense',
        amount: 5000,
        description: 'Staff training program',
        blockchainTxHash: '0xklm789nop012...',
      },
    ],
    fines: [
      {
        id: 'f2',
        date: '2026-03-22',
        type: 'fine',
        amount: 1000,
        memberId: 'u5',
        description: 'Late loan repayment penalty',
        blockchainTxHash: '0xnop012qrs345...',
      },
      {
        id: 'f3',
        date: '2026-04-04',
        type: 'fine',
        amount: 500,
        memberId: 'u7',
        description: 'Missed meeting attendance penalty',
        blockchainTxHash: '0xqrs345tuv678...',
      },
    ],
    blockchainLedger: [
      {
        txHash: '0xstu901vwx234...',
        timestamp: '2026-04-01T09:15:00Z',
        action: 'Contribution',
        details: 'Peter Ochieng deposited KSh 8,000',
      },
      {
        txHash: '0xvwx234yza567...',
        timestamp: '2026-03-28T16:45:00Z',
        action: 'Dividend Distributed',
        details: 'Q1 dividends paid via smart contract',
      },
      {
        txHash: '0xyza567bcd890...',
        timestamp: '2026-04-03T10:30:00Z',
        action: 'Loan Issued',
        details: 'Mary Akinyi received KSh 45,000 business expansion loan',
      },
      {
        txHash: '0xbcd890efg123...',
        timestamp: '2026-03-30T14:00:00Z',
        action: 'Contribution',
        details: 'Corporate member contributed KSh 12,000',
      },
      {
        txHash: '0xefg123hij456...',
        timestamp: '2026-04-05T11:20:00Z',
        action: 'Loan Repayment',
        details: 'Mary Akinyi repaid KSh 8,000 towards loan',
      },
    ],
  },
];

// Helper to get a user by email + password (for demo login)
export const getUserByCredentials = (
  email: string,
  password: string
): User | undefined => {
  return mockUsers.find((u) => u.email === email && u.password === password);
};

// Helper to get chama by ID
export const getChamaById = (id: string): Chama | undefined => {
  return mockChamas.find((c) => c.id === id);
};

// Helper to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((u) => u.id === id);
};

// Helper to calculate total savings across all members
export const calculateTotalSavings = (chama: Chama): number => {
  return chama.transactions
    .filter((t) => t.type === 'contribution')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Helper to calculate total loans issued
export const calculateTotalLoans = (chama: Chama): number => {
  return chama.transactions
    .filter((t) => t.type === 'loan')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Helper to get member's transactions
export const getMemberTransactions = (
  chama: Chama,
  memberId: string
): Transaction[] => {
  return chama.transactions.filter((t) => t.memberId === memberId);
};

export default {
  mockUsers,
  mockChamas,
  getUserByCredentials,
  getChamaById,
  getUserById,
  calculateTotalSavings,
  calculateTotalLoans,
  getMemberTransactions,
};
