import { useState, useEffect } from 'react';

interface FavoriteItem {
  label: string;
  color: string;
  lastVisited: string;
}

const FAVORITES_KEY = 'depity_favorites';
const MAX_FAVORITES = 3;

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(parsedFavorites);
      } else {
        // Initialize with default favorites
        const defaultFavorites: FavoriteItem[] = [
          { label: 'Depity Team', color: 'bg-purple-500', lastVisited: new Date().toISOString() },
          { label: 'Monday Redesign', color: 'bg-blue-500', lastVisited: new Date(Date.now() - 86400000).toISOString() },
          { label: 'Udemy Courses', color: 'bg-green-500', lastVisited: new Date(Date.now() - 172800000).toISOString() }
        ];
        setFavorites(defaultFavorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(defaultFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const addToFavorites = (pageName: string) => {
    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500', 'bg-pink-500'];
    
    setFavorites(prev => {
      // Remove if already exists
      const filtered = prev.filter(fav => fav.label !== pageName);
      
      // Add to beginning
      const newFavorite: FavoriteItem = {
        label: pageName,
        color: colors[Math.floor(Math.random() * colors.length)],
        lastVisited: new Date().toISOString()
      };
      
      // Keep only last 3
      const updated = [newFavorite, ...filtered].slice(0, MAX_FAVORITES);
      
      // Save to localStorage
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      
      return updated;
    });
  };

  return {
    favorites,
    addToFavorites
  };
};