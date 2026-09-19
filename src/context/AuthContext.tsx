import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, ProfileRecord, UserRole } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: ProfileRecord | null;
  session: Session | null;
  loading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isSeller: boolean;
  isBuyer: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  linkSolanaWallet: (address: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string, userMetadata?: Record<string, unknown>): Promise<ProfileRecord | null> => {
    if (!isSupabaseConfigured()) {
      // Mock profile when Supabase is not yet configured with real API keys
      return {
        id: userId,
        email: 'demo@intyfe.io',
        full_name: 'Demo Creator',
        avatar_url: null,
        role: (userMetadata?.role as UserRole) || 'admin',
        solana_wallet_address: null,
        created_at: new Date().toISOString(),
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // If trigger hasn't fired yet or error, fallback to metadata
        return {
          id: userId,
          email: user?.email || '',
          full_name: (userMetadata?.full_name as string) || '',
          avatar_url: null,
          role: (userMetadata?.role as UserRole) || 'buyer',
          solana_wallet_address: null,
          created_at: new Date().toISOString(),
        };
      }

      return data as ProfileRecord;
    } catch {
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const prof = await fetchProfile(user.id, user.user_metadata);
    setProfile(prof);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setLoading(false);
          return;
        }

        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            const prof = await fetchProfile(initialSession.user.id, initialSession.user.user_metadata);
            if (mounted) setProfile(prof);
          }
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    if (!isSupabaseConfigured()) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        const prof = await fetchProfile(newSession.user.id, newSession.user.user_metadata);
        if (mounted) setProfile(prof);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    if (!isSupabaseConfigured()) {
      // Mock signup in demo mode
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        email,
        user_metadata: { full_name: fullName, role },
      } as unknown as User;
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        email,
        full_name: fullName,
        avatar_url: null,
        role,
        solana_wallet_address: null,
        created_at: new Date().toISOString(),
      });
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) return { error };

    if (data.user) {
      const prof = await fetchProfile(data.user.id, { full_name: fullName, role });
      setProfile(prof);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Mock login in demo mode
      const mockUser = {
        id: 'mock-admin-id',
        email,
        user_metadata: { full_name: email.split('@')[0], role: 'admin' },
      } as unknown as User;
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        email,
        full_name: email.split('@')[0],
        avatar_url: null,
        role: 'admin',
        solana_wallet_address: null,
        created_at: new Date().toISOString(),
      });
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const linkSolanaWallet = async (address: string) => {
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    if (!isSupabaseConfigured()) {
      if (profile) {
        setProfile({ ...profile, solana_wallet_address: address });
      }
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ solana_wallet_address: address })
        .eq('id', user.id);

      if (error) return { success: false, error: error.message };

      if (profile) {
        setProfile({ ...profile, solana_wallet_address: address });
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update wallet';
      return { success: false, error: msg };
    }
  };

  const role = useMemo(() => profile?.role ?? null, [profile]);
  const isAdmin = useMemo(() => role === 'admin', [role]);
  const isSeller = useMemo(() => role === 'seller' || role === 'admin', [role]);
  const isBuyer = useMemo(() => role === 'buyer' || role === 'admin', [role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        role,
        isAdmin,
        isSeller,
        isBuyer,
        signUp,
        signIn,
        signOut,
        linkSolanaWallet,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
