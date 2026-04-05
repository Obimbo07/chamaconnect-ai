'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Chama, User } from '@/lib/mockData';
import { issueShares } from '@/utils/smartContractSimulator';
import { mockUsers } from '@/lib/mockData';

interface AdminShareIssuerProps {
  chama: Chama;
  currentUser: User;
  onUpdate: (updatedChama: Chama) => void;
}

export function AdminShareIssuer({ chama, currentUser, onUpdate }: AdminShareIssuerProps) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [sharesToIssue, setSharesToIssue] = useState('1');
  const [loading, setLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  // Only chairperson and treasurer can issue shares
  const canIssueShares =
    currentUser.role === 'chairperson' || currentUser.role === 'treasurer';

  // Get members that belong to this chama
  const chamaMembers = mockUsers.filter((u) => u.chamaId === chama.id);

  const handleIssueShares = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !sharesToIssue || !canIssueShares) return;

    setLoading(true);

    // Simulate smart contract execution
    setTimeout(() => {
      const shares = parseInt(sharesToIssue, 10);
      if (shares > 0) {
        const updatedChama = issueShares(chama, selectedMemberId, shares);
        onUpdate(updatedChama);

        // Show last transaction
        const txn = updatedChama.transactions[updatedChama.transactions.length - 1];
        setLastTransaction(txn);

        // Reset form
        setSelectedMemberId('');
        setSharesToIssue('1');
      }
      setLoading(false);
    }, 800);
  };

  const getMemberName = (memberId: string): string => {
    return mockUsers.find((u) => u.id === memberId)?.name || `Member ${memberId}`;
  };

  if (!canIssueShares) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Share Issuance (Admin Only)</CardTitle>
          <CardDescription>Issue shares to members</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            Only chairperson and treasurer can issue shares. Your role: {currentUser.role}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Issuance Control</CardTitle>
        <CardDescription>
          Issue new shares to members (Current utilization: {chama.shareCapital.utilizationPercent}%)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        <form onSubmit={handleIssueShares} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a member...</option>
              {chamaMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Number of Shares
            </label>
            <Input
              type="number"
              value={sharesToIssue}
              onChange={(e) => setSharesToIssue(e.target.value)}
              min="1"
              max="1000"
              disabled={loading}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400 mt-1">
              Total cost: KSh{' '}
              {(parseInt(sharesToIssue, 10) * chama.shareCapital.nominalValuePerShare).toLocaleString()}
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !selectedMemberId || !sharesToIssue}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Executing Smart Contract...' : 'Issue Shares'}
          </Button>
        </form>

        {/* Transaction Result */}
        {lastTransaction && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4">
            <h3 className="font-semibold text-green-300 mb-2">Share Issuance Successful</h3>
            <div className="text-sm text-green-200 space-y-1">
              <p>
                <span className="font-medium">Member:</span> {getMemberName(lastTransaction.memberId)}
              </p>
              <p>
                <span className="font-medium">Shares Issued:</span>{' '}
                {lastTransaction.amount / chama.shareCapital.nominalValuePerShare}
              </p>
              <p>
                <span className="font-medium">Total Cost:</span> KSh {lastTransaction.amount.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Tx Hash:</span>{' '}
                <code className="text-xs bg-black px-1 py-0.5 rounded">{lastTransaction.blockchainTxHash}</code>
              </p>
              <p>
                <span className="font-medium">Date:</span> {lastTransaction.date}
              </p>
            </div>
          </div>
        )}

        {/* Member Share Status */}
        <div className="border-t border-slate-700 pt-4">
          <h3 className="font-semibold text-slate-300 mb-3">Current Member Shares</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {chama.shareCapital.members.map((member) => {
              const memberInfo = mockUsers.find((u) => u.id === member.memberId);
              return (
                <div
                  key={member.memberId}
                  className="flex justify-between items-center p-2 bg-slate-700 rounded text-sm"
                >
                  <span className="text-slate-300">{memberInfo?.name || `Member ${member.memberId}`}</span>
                  <div className="text-right">
                    <p className="font-semibold text-slate-100">{member.sharesHeld} shares</p>
                    <p className="text-xs text-slate-400">{member.ownershipPercent.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capacity Info */}
        <div className="bg-slate-700 rounded-lg p-3 text-sm text-slate-300">
          <p className="mb-2">
            <span className="font-semibold">Max Capacity:</span> 10,000 shares
          </p>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${Math.min(chama.shareCapital.utilizationPercent, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {chama.shareCapital.totalIssuedShares} / 10,000 shares ({chama.shareCapital.utilizationPercent}%)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
