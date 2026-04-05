'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Chama } from '@/lib/mockData';

interface BlockchainLedgerProps {
  chama: Chama;
}

export function BlockchainLedger({ chama }: BlockchainLedgerProps) {
  const sortedLedger = [...chama.blockchainLedger].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'Contribution':
        return 'text-green-400';
      case 'Loan Issued':
        return 'text-yellow-400';
      case 'Loan Repayment':
        return 'text-blue-400';
      case 'Share Issuance':
        return 'text-purple-400';
      case 'Dividend Distributed':
        return 'text-pink-400';
      case 'Fine Applied':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getActionIcon = (action: string): string => {
    switch (action) {
      case 'Contribution':
        return '📥';
      case 'Loan Issued':
        return '🏦';
      case 'Loan Repayment':
        return '💳';
      case 'Share Issuance':
        return '📊';
      case 'Dividend Distributed':
        return '💰';
      case 'Fine Applied':
        return '⚠️';
      default:
        return '📝';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Immutable Blockchain Ledger</CardTitle>
        <CardDescription>
          All transactions recorded with cryptographic hash for security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {sortedLedger.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No transactions recorded yet</p>
            ) : (
              sortedLedger.map((entry, index) => (
                <div
                  key={index}
                  className="border border-slate-700 rounded-lg p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getActionIcon(entry.action)}</span>
                      <div>
                        <p className={`font-semibold ${getActionColor(entry.action)}`}>
                          {entry.action}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="ml-9 space-y-2">
                    <p className="text-sm text-slate-300">{entry.details}</p>

                    {/* TX Hash */}
                    <div className="bg-slate-900 rounded px-3 py-2 text-xs font-mono">
                      <p className="text-slate-400 mb-1">Transaction Hash:</p>
                      <p className="text-slate-200 break-all select-all">{entry.txHash}</p>
                    </div>

                    {/* Verification Badge */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-green-400">Verified on Blockchain</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs font-semibold text-slate-400 mb-3">Transaction Types:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span>📥</span>
              <span className="text-slate-300">Contribution</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏦</span>
              <span className="text-slate-300">Loan Issued</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💳</span>
              <span className="text-slate-300">Repayment</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span className="text-slate-300">Share Issuance</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span className="text-slate-300">Dividend</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span className="text-slate-300">Fine</span>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded text-xs text-blue-300">
          <p className="font-semibold mb-1">Security Notice</p>
          <p>
            All transactions are cryptographically secured with immutable hash values. Each transaction
            is permanently recorded and cannot be altered retroactively.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
