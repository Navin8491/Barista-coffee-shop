import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { favoriteService, Favorite } from '../services/favoriteService';

interface FavoriteContextType {
  favorites: Favorite[];
  favoritesLoading: boolean;
  fetchFavorites: () => Promise<void>;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (productId: number) => Promise<void>;
  removeFavoriteById: (favoriteId: number) => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(false);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setFavoritesLoading(false);
      return;
    }
    setFavoritesLoading(true);
    try {
      const { data, error } = await favoriteService.getFavorites(user.id);
      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error("Fetch error: favorites fetch failed in context:", err);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const isFavorite = (productId: number): boolean => {
    return favorites.some(fav => fav.product_id === productId);
  };

  const toggleFavorite = async (productId: number) => {
    if (!user) {
      throw new Error("You must be logged in to favorite items.");
    }

    const existingFav = favorites.find(fav => fav.product_id === productId);
    try {
      if (existingFav) {
        // Optimistic update
        setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
        const { error } = await favoriteService.removeFavorite(user.id, productId);
        if (error) {
          // Rollback on error
          setFavorites(prev => [...prev, existingFav]);
          throw error;
        }
      } else {
        // Optimistic update placeholder (will be overwritten by database return)
        const placeholder: Favorite = {
          id: Date.now(), // temporary id
          user_id: user.id,
          product_id: productId,
          created_at: new Date().toISOString()
        };
        setFavorites(prev => [placeholder, ...prev]);

        const { data, error } = await favoriteService.addFavorite(
          user.id, 
          productId, 
          profile?.email, 
          profile?.full_name
        );
        if (error) {
          setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
          throw error;
        }
        if (data) {
          setFavorites(prev => prev.map(fav => fav.product_id === productId ? data : fav));
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      throw err;
    }
  };

  const removeFavoriteById = async (favoriteId: number) => {
    const backup = [...favorites];
    try {
      // Optimistic update
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      const { error } = await favoriteService.removeFavoriteById(favoriteId);
      if (error) {
        setFavorites(backup);
        throw error;
      }
    } catch (err) {
      console.error("Error removing favorite by ID:", err);
      throw err;
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, favoritesLoading, fetchFavorites, isFavorite, toggleFavorite, removeFavoriteById }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
