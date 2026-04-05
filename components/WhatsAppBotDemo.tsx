'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { User, Chama } from '@/lib/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface WhatsAppBotDemoProps {
  user: User;
  chama: Chama;
}

export function WhatsAppBotDemo({ user, chama }: WhatsAppBotDemoProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${user.name.split(' ')[0]}! Welcome to ChamaAI WhatsApp Bot. Send a message to get started.`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const quickReplies = [
    'Check balance',
    'My loans',
    'Share info',
    'Help',
  ];

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';

      if (messageText.toLowerCase().includes('balance')) {
        botResponse = `Your balance:\n\n💰 Shares: ${chama.shareCapital.members.find((m) => m.memberId === user.id)?.sharesHeld || 0}\n💵 Total Savings: KSh ${chama.transactions.filter((t) => t.memberId === user.id && t.type === 'contribution').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`;
      } else if (messageText.toLowerCase().includes('loan')) {
        botResponse = `Your loan status:\n\n🏦 Outstanding: KSh ${(chama.transactions.filter((t) => t.memberId === user.id && t.type === 'loan').reduce((sum, t) => sum + t.amount, 0) - chama.transactions.filter((t) => t.memberId === user.id && t.type === 'repayment').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}\n📊 Repayment Progress: Good standing`;
      } else if (messageText.toLowerCase().includes('share')) {
        botResponse = `Share information:\n\n📈 Ownership: ${(chama.shareCapital.members.find((m) => m.memberId === user.id)?.ownershipPercent || 0).toFixed(1)}%\n💎 Value per share: KSh ${chama.shareCapital.nominalValuePerShare}`;
      } else if (messageText.toLowerCase().includes('help')) {
        botResponse = `How can I help?\n\n📱 Send:\n• "balance" - Check account\n• "loans" - Loan status\n• "shares" - Share info\n• "contribute" - Make payment`;
      } else {
        botResponse = `Thanks for your message! Try asking about your balance, loans, shares, or how to contribute.`;
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle>WhatsApp Bot Demo</CardTitle>
        <CardDescription>Text-based access via WhatsApp (save contact: +254 711 000 001)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-slate-700 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 px-3 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <Button
              key={reply}
              onClick={() => handleSendMessage(reply)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {reply}
            </Button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Send
          </Button>
        </form>

        {/* Info */}
        <div className="p-3 bg-slate-700 rounded text-xs text-slate-300">
          <p className="font-semibold mb-1">WhatsApp Benefits</p>
          <p>Works with any WhatsApp account. No app installation needed. Encrypted messaging for security.</p>
        </div>
      </CardContent>
    </Card>
  );
}
