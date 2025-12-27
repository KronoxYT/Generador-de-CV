'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

type FirebaseLikeUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

interface SupabaseProviderProps {
  children: ReactNode;
  supabase: SupabaseClient | null;
}

interface SupabaseContextState {
  supabase: SupabaseClient | null;
  user: FirebaseLikeUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  areServicesAvailable: boolean;
}

export const FirebaseContext = createContext<SupabaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<SupabaseProviderProps> = ({ children, supabase }) => {
  const [user, setUser] = useState<FirebaseLikeUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const client = supabase;
    if (!client) {
      setIsUserLoading(false);
      return;
    }
    client.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setUserError(error);
        setUser(null);
      } else {
        setUser(mapSupabaseUser(data.user));
      }
      setIsUserLoading(false);
    });
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsUserLoading(false);
    });
    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, [supabase]);

  const contextValue = useMemo((): SupabaseContextState => {
    return {
      supabase,
      user,
      isUserLoading,
      userError,
      areServicesAvailable: !!supabase,
    };
  }, [supabase, user, isUserLoading, userError]);

  return <FirebaseContext.Provider value={contextValue}>{children}</FirebaseContext.Provider>;
};

function mapSupabaseUser(u: SupabaseUser | null): FirebaseLikeUser | null {
  if (!u) return null;
  const meta = (u.user_metadata || {}) as Record<string, any>;
  return {
    uid: u.id,
    email: u.email ?? null,
    displayName: (meta.full_name ?? meta.name ?? null) as string | null,
    photoURL: (meta.avatar_url ?? null) as string | null,
  };
}

export const useSupabase = (): SupabaseClient => {
  const ctx = useContext(FirebaseContext);
  return (ctx?.supabase as SupabaseClient | null) as any;
};

export const useUser = () => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useUser must be used within provider');
  }
  return {
    user: ctx.user,
    isUserLoading: ctx.isUserLoading,
    userError: ctx.userError,
  };
};
