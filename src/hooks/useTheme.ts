import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../../constants';

export type ThemeMode = 'light' | 'dark';

interface UseThemeReturn {
  isDarkMode: boolean;
  isHighContrast: boolean;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  setTheme: (mode: ThemeMode) => void;
}

/**
 * Custom hook for managing theme (dark mode & high contrast)
 */
export function useTheme(): UseThemeReturn {
  // Initialize dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored) {
        return stored === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Initialize high contrast from localStorage
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST) === 'true';
    }
    return false;
  });

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }

    if (isHighContrast) {
      root.classList.add('high-contrast');
      localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, 'true');
    } else {
      root.classList.remove('high-contrast');
      localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, 'false');
    }
  }, [isDarkMode, isHighContrast]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no stored preference
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast(prev => !prev);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setIsDarkMode(mode === 'dark');
  }, []);

  return {
    isDarkMode,
    isHighContrast,
    toggleTheme,
    toggleHighContrast,
    setTheme
  };
}

export default useTheme;
