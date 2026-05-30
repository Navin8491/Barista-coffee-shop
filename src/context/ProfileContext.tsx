import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { profileService, Profile } from '../services/profileService';

interface ProfileContextType {
  profile: Profile | null;
  profileLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => Promise<Profile>;
  uploadAvatar: (file: File) => Promise<string>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const { data, error } = await profileService.getProfile(user.id);
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Fetch error: profile fetch failed in context:", err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (profileData: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) {
      throw new Error("No authenticated user.");
    }
    try {
      const { data, error } = await profileService.updateProfile(user.id, profileData);
      if (error) throw error;
      if (data) {
        setProfile(data);
      }
      return data as Profile;
    } catch (err) {
      console.error("Error updating profile in context:", err);
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      throw new Error("No authenticated user.");
    }
    try {
      const { data: avatarUrl, error: uploadErr } = await profileService.uploadAvatar(user.id, file);
      if (uploadErr || !avatarUrl) throw uploadErr || new Error("Failed to get uploaded avatar URL.");

      // Automatically update the profile with the new avatar URL
      await updateProfile({ avatar_url: avatarUrl });
      return avatarUrl;
    } catch (err) {
      console.error("Error uploading avatar in context:", err);
      throw err;
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, profileLoading, fetchProfile, updateProfile, uploadAvatar }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
