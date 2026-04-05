'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChamaContext } from '@/contexts/ChamaContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { USSDSimulator } from '@/components/USSDSimulator';
import { WhatsAppBotDemo } from '@/components/WhatsAppBotDemo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccessibilityPage() {
  const router = useRouter();
  const { currentUser, currentChama } = useChamaContext();

  useEffect(() => {
    if (!currentUser || !currentChama) {
      router.push('/login');
    }
  }, [currentUser, currentChama, router]);

  if (!currentUser || !currentChama) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Accessibility Features</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={() => router.back()}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>USSD Access</CardTitle>
              <CardDescription>For feature phones and low connectivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-white mb-2">Dial Code:</p>
                <p className="text-2xl font-mono text-green-400">*384*6001#</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Benefits:</p>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>Works on any phone</li>
                  <li>No data connection needed</li>
                  <li>No app installation</li>
                  <li>Simple menu navigation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Bot</CardTitle>
              <CardDescription>For smartphones with messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-white mb-2">Contact Number:</p>
                <p className="text-2xl font-mono text-green-400">+254 711 000 001</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Benefits:</p>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>Chat-based interface</li>
                  <li>End-to-end encryption</li>
                  <li>Rich message formatting</li>
                  <li>Quick reply buttons</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simulators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <USSDSimulator user={currentUser} chama={currentChama} />
          <WhatsAppBotDemo user={currentUser} chama={currentChama} />
        </div>

        {/* Impact Info */}
        <Card className="mt-8 border-slate-600">
          <CardHeader>
            <CardTitle>Financial Inclusion Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-700 rounded">
                <p className="text-3xl font-bold text-blue-400">87%</p>
                <p className="text-sm text-slate-300 mt-1">Kenyans use feature phones</p>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <p className="text-3xl font-bold text-green-400">350M</p>
                <p className="text-sm text-slate-300 mt-1">WhatsApp users in Africa</p>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <p className="text-3xl font-bold text-purple-400">91%</p>
                <p className="text-sm text-slate-300 mt-1">USSD market penetration</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-4">
              ChamaAI leverages existing infrastructure - USSD, WhatsApp, and mobile money - to ensure
              no one is left behind. Whether your members have smartphones or feature phones, connectivity or not,
              they can access their chama finances anytime, anywhere.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
