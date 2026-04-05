'use client';

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { Chama } from '@/lib/mockData';
import {
  calculateTotalSavings,
  calculateTotalLoans,
} from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DeFiVisualizerProps {
  chama: Chama;
}

export function DeFiVisualizer({ chama }: DeFiVisualizerProps) {
  // Prepare ownership data for pie chart
  const ownershipData = chama.shareCapital.members
    .filter((m) => m.sharesHeld > 0)
    .map((m) => ({
      name: getMemberName(m.memberId),
      value: m.ownershipPercent,
      shares: m.sharesHeld,
    }));

  // Prepare transaction timeline
  const transactionTimeline = chama.transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t) => ({
      date: t.date,
      contributions: t.type === 'contribution' ? t.amount : 0,
      loans: t.type === 'loan' ? t.amount : 0,
      repayments: t.type === 'repayment' ? t.amount : 0,
    }));

  // Aggregate by date
  const aggregatedTimeline = Object.values(
    transactionTimeline.reduce(
      (acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, contributions: 0, loans: 0, repayments: 0 };
        }
        acc[item.date].contributions += item.contributions;
        acc[item.date].loans += item.loans;
        acc[item.date].repayments += item.repayments;
        return acc;
      },
      {} as Record<string, any>
    )
  );

  // Transaction type breakdown
  const transactionBreakdown = [
    {
      type: 'Contributions',
      count: chama.transactions.filter((t) => t.type === 'contribution').length,
      amount: chama.transactions
        .filter((t) => t.type === 'contribution')
        .reduce((sum, t) => sum + t.amount, 0),
    },
    {
      type: 'Loans',
      count: chama.transactions.filter((t) => t.type === 'loan').length,
      amount: chama.transactions
        .filter((t) => t.type === 'loan')
        .reduce((sum, t) => sum + t.amount, 0),
    },
    {
      type: 'Repayments',
      count: chama.transactions.filter((t) => t.type === 'repayment').length,
      amount: chama.transactions
        .filter((t) => t.type === 'repayment')
        .reduce((sum, t) => sum + t.amount, 0),
    },
  ];

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  const totalSavings = calculateTotalSavings(chama);
  const totalLoans = calculateTotalLoans(chama);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">Total Share Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {chama.shareCapital.totalValue.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">{chama.shareCapital.totalIssuedShares} shares issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chama.shareCapital.utilizationPercent}%</div>
            <p className="text-xs text-slate-400 mt-1">of 10,000 share capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalSavings.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">{chama.transactions.filter((t) => t.type === 'contribution').length} contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalLoans.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">{chama.transactions.filter((t) => t.type === 'loan').length} loans active</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ownership Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Share Ownership Distribution</CardTitle>
            <CardDescription>Member ownership percentages</CardDescription>
          </CardHeader>
          <CardContent>
            {ownershipData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ownershipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ownershipData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No shares issued yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Capital Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Timeline</CardTitle>
            <CardDescription>Contributions, loans, and repayments over time</CardDescription>
          </CardHeader>
          <CardContent>
            {aggregatedTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={aggregatedTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="contributions" stroke="#10b981" name="Contributions" />
                  <Line type="monotone" dataKey="loans" stroke="#f59e0b" name="Loans" />
                  <Line type="monotone" dataKey="repayments" stroke="#3b82f6" name="Repayments" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No transactions recorded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Overview of all transaction types</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Amount (KSh)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Transaction Count" />
              <Bar yAxisId="right" dataKey="amount" fill="#8b5cf6" name="Total Amount" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function getMemberName(memberId: string): string {
  const names: { [key: string]: string } = {
    u1: 'Austin',
    u2: 'John',
    u3: 'Jane',
    u4: 'Peter',
    u5: 'Mary',
    u6: 'Corporate A',
    u7: 'David',
    u8: 'Sarah',
    u9: 'James',
  };
  return names[memberId] || `Member ${memberId}`;
}
