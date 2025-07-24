import { useState, useEffect } from 'react';

// Custom hook for localStorage with React state synchronization
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for managing arrays in localStorage with common operations
export function useLocalStorageArray<T extends { id: string }>(key: string, initialValue: T[] = []) {
  const [items, setItems] = useLocalStorage<T[]>(key, initialValue);

  const addItem = (item: T) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (id: string, updates: Partial<T>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getItem = (id: string): T | undefined => {
    return items.find(item => item.id === id);
  };

  return {
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
    getItem
  };
}