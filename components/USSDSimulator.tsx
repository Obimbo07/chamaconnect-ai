'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { User, Chama } from '@/lib/mockData';

interface USSDSimulatorProps {
  user: User;
  chama: Chama;
}

export function USSDSimulator({ user, chama }: USSDSimulatorProps) {
  const [screen, setScreen] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // USSD Menu Structure
  const menus = [
    {
      id: 0,
      title: 'Welcome to ChamaAI USSD',
      content: `Welcome ${user.name.split(' ')[0]}!\n\n${chama.name}`,
      options: [
        { text: '1. Check Balance', action: 1 },
        { text: '2. View Loans', action: 2 },
        { text: '3. Make Contribution', action: 3 },
        { text: '0. Exit', action: -1 },
      ],
    },
    {
      id: 1,
      title: 'Account Balance',
      content: `Your Account Summary:\n\nShares: ${chama.shareCapital.members.find((m) => m.memberId === user.id)?.sharesHeld || 0}\nShares Value: KSh ${(chama.shareCapital.members.find((m) => m.memberId === user.id)?.shareValue || 0).toLocaleString()}\n\nTotal Savings: KSh ${chama.transactions.filter((t) => t.memberId === user.id && t.type === 'contribution').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`,
      options: [
        { text: '0. Back to Menu', action: 0 },
      ],
    },
    {
      id: 2,
      title: 'Your Loans',
      content: `Active Loans:\n\nTotal Issued: KSh ${chama.transactions.filter((t) => t.memberId === user.id && t.type === 'loan').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}\n\nRepaid: KSh ${chama.transactions.filter((t) => t.memberId === user.id && t.type === 'repayment').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}\n\nOutstanding: KSh ${(chama.transactions.filter((t) => t.memberId === user.id && t.type === 'loan').reduce((sum, t) => sum + t.amount, 0) - chama.transactions.filter((t) => t.memberId === user.id && t.type === 'repayment').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}`,
      options: [
        { text: '1. Request New Loan', action: 3 },
        { text: '0. Back to Menu', action: 0 },
      ],
    },
    {
      id: 3,
      title: 'Make Contribution',
      content: `Select Amount:\n\n1. KSh 1,000\n2. KSh 2,000\n3. KSh 5,000\n4. Custom Amount`,
      options: [
        { text: '1. KSh 1,000', action: 4 },
        { text: '2. KSh 2,000', action: 4 },
        { text: '3. KSh 5,000', action: 4 },
        { text: '0. Back', action: 0 },
      ],
    },
    {
      id: 4,
      title: 'Contribution Confirmed',
      content: `Your contribution has been recorded.\n\nYou will receive an M-Pesa prompt on your phone to complete the payment.\n\nTransaction Reference: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      options: [
        { text: '0. Back to Menu', action: 0 },
      ],
    },
  ];

  const currentMenu = menus[screen];

  const handleSelectOption = (actionScreen: number) => {
    if (actionScreen === -1) {
      setScreen(0);
      setSelectedOption(null);
    } else {
      setScreen(actionScreen);
      setSelectedOption(null);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>USSD Simulator (Feature-Phone Access)</CardTitle>
        <CardDescription>Accessible via *384*6001# on any phone</CardDescription>
      </CardHeader>
      <CardContent>
        {/* USSD Screen */}
        <div className="bg-green-900 border-2 border-green-700 rounded-lg p-4 mb-4 font-mono text-sm text-green-300 min-h-[200px]">
          <div className="mb-4">
            <p className="font-bold mb-2">{currentMenu.title}</p>
            <p className="whitespace-pre-wrap text-xs">{currentMenu.content}</p>
          </div>
          <div className="border-t border-green-700 pt-2 text-xs">
            <p className="text-green-400">Reply with option number</p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentMenu.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleSelectOption(option.action)}
              variant={selectedOption === index ? 'default' : 'outline'}
              className="w-full justify-start font-mono text-sm"
            >
              {option.text}
            </Button>
          ))}
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-slate-700 rounded text-xs text-slate-300">
          <p className="font-semibold mb-1">Why USSD?</p>
          <p>Works on any phone - no data required. Perfect for members with feature phones or low connectivity.</p>
        </div>
      </CardContent>
    </Card>
  );
}
