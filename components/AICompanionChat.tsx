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
  sender: 'user' | 'ai';
  language: 'en' | 'sw';
  timestamp: Date;
  ragContext?: {
    intent: string[];
    hasRealAPIResponse: boolean;
  };
}

interface AICompanionChatProps {
  user: User;
  chama: Chama;
}

export function AICompanionChat({ user, chama }: AICompanionChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Habari ${user.name}! Karibu, mimi ni AI Companion wako. Ninaweza kukusaidia na maswali kuhusu akshi, mikopo, kusambaza pesa, na malipo. Jaribu kuuliza chochote!`,
      sender: 'ai',
      language: 'sw',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      language,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId: user.id,
          chamaId: chama.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: 'ai',
        language: data.language,
        timestamp: new Date(),
        ragContext: data.ragContext,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLanguage(data.language);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        language: 'en',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle>AI Financial Companion</CardTitle>
        <CardDescription>Ask me about shares, loans, savings, and more</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.language === 'sw' ? '🇰🇪 SW' : '🇬🇧 EN'}
                      {msg.ragContext && msg.ragContext.hasRealAPIResponse && ' ✓ HF API'}
                    </p>
                  </div>
                  {msg.ragContext && (
                    <div className="text-xs text-slate-500 mt-1 ml-2">
                      Intent: {msg.ragContext.intent.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg rounded-bl-none">
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

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about shares, loans, savings..."
            disabled={loading}
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Send
          </Button>
        </form>

        {/* Language Toggle */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('sw')}
            className={`px-3 py-1 rounded ${
              language === 'sw'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            Swahili
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
