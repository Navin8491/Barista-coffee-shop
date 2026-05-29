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
      console.log("Before Profile Fetch");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log("After Profile Fetch");
      console.log("Profile Data:", data);
      console.log("Profile Error:", error);

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

    const initializeAuth = async () => {
      try {
        console.log("Auth initialization start");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session loaded");
        if (session?.user) {
          console.log("Session User Found:", session.user.email);
          if (active) {
            setUser(session.user);
            const p = await fetchProfile(session.user.id);
            setProfile(p);
          }
        } else {
          console.log("No Session User Found");
          if (active) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Auth Initialization Error:", error);
      } finally {
        if (active) {
          setLoading(false);
          console.log("Auth loading complete");
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Changed Event:", event);
      try {
        if (session?.user) {
          if (active) {
            setUser(session.user);
            const p = await fetchProfile(session.user.id);
            setProfile(p);
          }
        } else {
          if (active) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Auth State Change Error:", error);
      } finally {
        if (active) {
          setLoading(false);
          console.log("Auth loading complete");
        }
      }
    });

    return () => {
      active = false;
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
        try {
          console.log("Before Profile Insert");
          const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              full_name: fullName,
              email: email
            })
            .select()
            .single();

          console.log("After Profile Insert");
          console.log("Profile Insert Data:", insertData);
          console.log("Profile Insert Error:", insertError);

          if (insertError) throw insertError;
        } catch (err) {
          console.error("Error inserting fallback profile:", err);
        }
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
    try {
      console.log("Before Profile Update");
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      console.log("After Profile Update");
      console.log("Profile Update Data:", data);
      console.log("Profile Update Error:", error);

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Profile Update Failed:", err);
      throw err;
    }
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
