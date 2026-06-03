import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, RegisterParams } from '../services/authService';

// Timers config (15 min total activity time before logout. Warning shows 30 seconds before that.)
const INACTIVITY_TIMEOUT = 14.5 * 60 * 1000; // 14.5 minutes in ms
const WARNING_COUNTDOWN_START = 30; // 30 seconds warning countdown

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<any>;
  signUp: (params: RegisterParams) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  showLogoutWarning: boolean;
  logoutCountdown: number;
  wasAutoLoggedOut: boolean;
  setWasAutoLoggedOut: (value: boolean) => void;
  stayLoggedIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLogoutWarning, setShowLogoutWarning] = useState<boolean>(false);
  const [logoutCountdown, setLogoutCountdown] = useState<number>(WARNING_COUNTDOWN_START);
  const [wasAutoLoggedOut, setWasAutoLoggedOut] = useState<boolean>(false);

  const inactivityTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const showWarningRef = useRef<boolean>(false);

  useEffect(() => {
    showWarningRef.current = showLogoutWarning;
  }, [showLogoutWarning]);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setShowLogoutWarning(true);
      startCountdown();
    }, INACTIVITY_TIMEOUT);
  };

  const startCountdown = () => {
    setLogoutCountdown(WARNING_COUNTDOWN_START);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = setInterval(() => {
      setLogoutCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          handleAutoLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoLogout = async () => {
    setWasAutoLoggedOut(true);
    await logout();
    setShowLogoutWarning(false);
  };

  const stayLoggedIn = () => {
    setShowLogoutWarning(false);
    resetInactivityTimer();
  };

  useEffect(() => {
    if (user) {
      resetInactivityTimer();

      const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

      const handleActivity = () => {
        if (!showWarningRef.current) {
          resetInactivityTimer();
        }
      };

      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });

      return () => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        activityEvents.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
      };
    } else {
      setShowLogoutWarning(false);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
  }, [user]);

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
    setShowLogoutWarning(false);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
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
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signUp, 
      logout, 
      resetPassword, 
      updatePassword,
      showLogoutWarning,
      logoutCountdown,
      wasAutoLoggedOut,
      setWasAutoLoggedOut,
      stayLoggedIn
    }}>
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
