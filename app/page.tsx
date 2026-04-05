'use client';

import { useRouter } from 'next/navigation';
import { useChamaContext } from '@/contexts/ChamaContext';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { currentUser } = useChamaContext();

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  return null;
}
