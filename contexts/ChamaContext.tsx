'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Chama, User } from '@/lib/mockData';
import { mockChamas, mockUsers } from '@/lib/mockData';

interface ChamaContextType {
  currentUser: User | null;
  currentChama: Chama | null;
  setCurrentUser: (user: User | null) => void;
  setCurrentChama: (chama: Chama | null) => void;
  updateChamaData: (chama: Chama) => void;
  logout: () => void;
  allChamas: Chama[];
  allUsers: User[];
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export function ChamaProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentChama, setCurrentChama] = useState<Chama | null>(null);
  const [allChamas, setAllChamas] = useState<Chama[]>(mockChamas);
  const [allUsers] = useState<User[]>(mockUsers);

  const updateChamaData = useCallback((updatedChama: Chama) => {
    setCurrentChama(updatedChama);
    setAllChamas((prev) =>
      prev.map((c) => (c.id === updatedChama.id ? updatedChama : c))
    );
  }, []);

  const handleSetCurrentChama = useCallback(
    (chama: Chama | null) => {
      setCurrentChama(chama);
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentChama(null);
  }, []);

  return (
    <ChamaContext.Provider
      value={{
        currentUser,
        currentChama,
        setCurrentUser,
        setCurrentChama: handleSetCurrentChama,
        updateChamaData,
        logout,
        allChamas,
        allUsers,
      }}
    >
      {children}
    </ChamaContext.Provider>
  );
}

export function useChamaContext() {
  const context = useContext(ChamaContext);
  if (!context) {
    throw new Error(
      'useChamaContext must be used within a ChamaProvider'
    );
  }
  return context;
}
