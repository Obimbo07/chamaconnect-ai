'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useChamaContext } from '@/contexts/ChamaContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DeFiVisualizer } from '@/components/DeFiVisualizer';
import { AdminShareIssuer } from '@/components/AdminShareIssuer';
import { BlockchainLedger } from '@/components/BlockchainLedger';
import { AICompanionChat } from '@/components/AICompanionChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockChamas } from '@/lib/mockData';
import type { Chama } from '@/lib/mockData';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, currentChama, updateChamaData, logout, allChamas } = useChamaContext();
  const [displayChama, setDisplayChama] = useState<Chama | null>(currentChama);

  useEffect(() => {
    if (!currentUser || !currentChama) {
      router.push('/login');
    }
  }, [currentUser, currentChama, router]);

  if (!currentUser || !currentChama) {
    return null;
  }

  const handleChamaSwitch = (chamaId: string) => {
    const newChama = allChamas.find((c) => c.id === chamaId);
    if (newChama) {
      setDisplayChama(newChama);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ChamaAI Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {currentUser.name} ({currentUser.role})
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Chama Selector */}
            <select
              value={displayChama?.id || ''}
              onChange={(e) => handleChamaSwitch(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {allChamas.map((chama) => (
                <option key={chama.id} value={chama.id}>
                  {chama.name} ({chama.type})
                </option>
              ))}
            </select>
            <ThemeToggle />
            <Button
              onClick={() => router.push('/dashboard/accessibility')}
              variant="outline"
            >
              Accessibility
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {displayChama && (
          <>
            {/* Chama Info */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{displayChama.name}</CardTitle>
                  <CardDescription>
                    Type: {displayChama.type} | Members: {displayChama.membersCount}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="admin">Share Manager</TabsTrigger>
                <TabsTrigger value="ledger">Blockchain</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <DeFiVisualizer chama={displayChama} />
              </TabsContent>

              {/* Share Manager Tab */}
              <TabsContent value="admin">
                <AdminShareIssuer
                  chama={displayChama}
                  currentUser={currentUser}
                  onUpdate={(updatedChama) => {
                    setDisplayChama(updatedChama);
                    updateChamaData(updatedChama);
                  }}
                />
              </TabsContent>

              {/* Blockchain Tab */}
              <TabsContent value="ledger">
                <BlockchainLedger chama={displayChama} />
              </TabsContent>

              {/* AI Assistant Tab */}
              <TabsContent value="ai">
                <AICompanionChat user={currentUser} chama={displayChama} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
