import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, RegisterParams } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<any>;
  signUp: (params: RegisterParams) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    console.log("Auth start: initializing listener");

    // Initialize session from current Supabase client cache/auth
    const initSession = async () => {
      try {
        console.log("Auth start: fetching initial session");
        const { data: session, error } = await authService.getSession();
        if (error) {
          console.error("Auth error: failed to fetch initial session:", error);
        }
        if (session?.user && active) {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Auth error: exception in initSession:", err);
      } finally {
        if (active) {
          setLoading(false);
          console.log("Auth complete: initial session loaded");
        }
      }
    };

    initSession();

    // Set up auth state change subscription
    const subscription = authService.onAuthStateChange((event, session) => {
      console.log(`Auth start: event=${event}`, session?.user?.email);
      if (active) {
        setUser(session?.user || null);
        setLoading(false);
        console.log(`Auth complete: state changed (${event})`);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string) => {
    const { data, error } = await authService.login(email, password);
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const signUp = async (params: RegisterParams) => {
    const { data, error } = await authService.register(params);
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await authService.logout();
    if (error) throw error;
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    // We redirect to /reset-password route
    const { data, error } = await authService.forgotPassword(email, `${window.location.origin}/reset-password`);
    if (error) throw error;
    return data;
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await authService.updatePassword(password);
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
