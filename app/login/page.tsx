'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChamaContext } from '@/contexts/ChamaContext';
import { mockUsers, mockChamas, getUserByCredentials, getChamaById } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const quickAccessUsers = [
  {
    email: 'obimboausts@gmail.com',
    password: 's0ftware123##',
    label: 'Austin Obimbo (Chairperson)',
    description: 'Obimbo Chama - Growth Stage',
  },
  {
    email: 'jane.wanjiku@example.com',
    password: 'member123',
    label: 'Jane Wanjiku (Treasurer)',
    description: 'Obimbo Chama - Finance View',
  },
  {
    email: 'john.doe@example.com',
    password: 'member123',
    label: 'John Doe (Member)',
    description: 'Obimbo Chama - Member View',
  },
  {
    email: 'peter.och@example.com',
    password: 'sacco123',
    label: 'Peter Ochieng (Chairperson)',
    description: 'Umoja SACCO - Mature Stage',
  },
  {
    email: 'mary.akinyi@example.com',
    password: 'sacco123',
    label: 'Mary Akinyi (Member)',
    description: 'Umoja SACCO - Member View',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, setCurrentChama } = useChamaContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const user = getUserByCredentials(loginEmail, loginPassword);
      if (user) {
        const chama = getChamaById(user.chamaId);
        if (chama) {
          setCurrentUser(user);
          setCurrentChama(chama);
          router.push('/dashboard');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">ChamaAI</h1>
          <p className="text-lg text-slate-300">Blockchain-Powered Savings Groups</p>
          <p className="text-sm text-slate-400 mt-2">AI-driven financial management for African chamas and SACCOs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manual Login Form */}
          <Card className="lg:col-span-1 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Manual Login</CardTitle>
              <CardDescription className="text-slate-400">Enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Access Cards */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-slate-300 text-sm font-medium mb-3">Quick Access - Demo Users</p>
            {quickAccessUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleLogin(user.email, user.password)}
                disabled={loading}
                className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <p className="font-medium text-white">{user.label}</p>
                <p className="text-sm text-slate-400">{user.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Test Credentials Info */}
        <div className="mt-8 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <p className="text-sm text-slate-300">
            <span className="font-semibold">Demo Purpose:</span> Use any of the quick access buttons above or manually enter credentials to explore the ChamaAI platform. The system uses mock data to demonstrate AI-powered DeFi management for African savings groups.
          </p>
        </div>
      </div>
    </div>
  );
}
