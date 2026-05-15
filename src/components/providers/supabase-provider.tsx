'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

interface SupabaseContextType {
  user: UserProfile | null;
  isUserLoading: boolean;
  error: Error | null;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mapUser = (u: SupabaseUser | null): UserProfile | null => {
    if (!u) return null;
    const meta = u.user_metadata || {};
    return {
      uid: u.id,
      email: u.email ?? null,
      displayName: (meta.full_name ?? meta.name ?? null) as string | null,
      photoURL: (meta.avatar_url ?? null) as string | null,
    };
  };

  useEffect(() => {
    if (!supabase) {
      // Mock user for testing without credentials
      setUser({
        uid: 'mock-user-123',
        email: 'invitado@meavitae.com',
        displayName: 'Invitado MeaVitae',
        photoURL: null,
      });
      setIsUserLoading(false);
      return;
    }

    // Initial user fetch
    supabase.auth.getUser().then(({ data, error: err }) => {
      if (err) {
        setError(err);
      } else if (data.user) {
        setUser(mapUser(data.user));
      }
      setIsUserLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null));
      setIsUserLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ user, isUserLoading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseProvider');
  }
  return context;
};
