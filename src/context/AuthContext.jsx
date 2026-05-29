import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile matching user_id
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let active = true;

    // Safety timeout to prevent infinite loading screen
    const safetyTimeout = setTimeout(() => {
      if (active) {
        console.warn('Auth initialization timed out. Forcing loading to complete.');
        setLoading(false);
      }
    }, 4000);

    const initAuth = async () => {
      try {
        console.log("Auth Initialization Started");
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("Session User Found:", session.user.email);
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } else {
          console.log("No Session User Found");
        }
      } catch (err) {
        console.error("Auth Initialization Error:", err);
      } finally {
        if (active) {
          setLoading(false);
          clearTimeout(safetyTimeout);
          console.log("Auth Initialization Complete");
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Changed Event:", event);
      try {
        if (session?.user) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth State Change Error:", err);
      } finally {
        if (active) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    });

    return () => {
      active = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    
    // Fallback: If user is auto-confirmed or signed up, ensure profile is inserted if trigger failed
    if (data?.user) {
      const existing = await fetchProfile(data.user.id);
      if (!existing) {
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          full_name: fullName,
          email: email
        });
      }
    }
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No logged-in user');
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  const value = {
    user,
    profile,
    loading,
    login,
    signUp,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
