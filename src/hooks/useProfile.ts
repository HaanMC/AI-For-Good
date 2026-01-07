import { useState, useEffect, useCallback } from 'react';
import { UserProfile, ExamHistory } from '../../types';
import { STORAGE_KEYS } from '../../constants';

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  hasProfile: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveProfile: (profile: UserProfile) => void;
  addExamHistory: (exam: ExamHistory) => void;
  removeExamHistory: (examId: string) => void;
  clearProfile: () => void;
}

const DEFAULT_PREFERENCES: UserProfile['preferences'] = {
  fontSize: 'medium',
  autoSave: true,
  studyReminders: true,
  examSecurityEnabled: true,
  personalizationEnabled: true,
  concurrentTasksEnabled: false,
  maxConcurrentTasks: 1
};

/**
 * Custom hook for managing user profile with localStorage persistence
 */
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure preferences exist
        parsed.preferences = { ...DEFAULT_PREFERENCES, ...parsed.preferences };
        setProfile(parsed);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  const persistProfile = useCallback((newProfile: UserProfile | null) => {
    if (newProfile) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    }
  }, []);

  // Save complete profile
  const saveProfile = useCallback((newProfile: UserProfile) => {
    const profileWithDefaults: UserProfile = {
      ...newProfile,
      preferences: { ...DEFAULT_PREFERENCES, ...newProfile.preferences }
    };
    setProfile(profileWithDefaults);
    persistProfile(profileWithDefaults);
  }, [persistProfile]);

  // Update partial profile
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      persistProfile(updated);
      return updated;
    });
  }, [persistProfile]);

  // Add exam to history
  const addExamHistory = useCallback((exam: ExamHistory) => {
    setProfile(prev => {
      if (!prev) return null;

      const examHistory = [...(prev.examHistory || []), exam];
      // Keep only last 50 exams
      if (examHistory.length > 50) {
        examHistory.shift();
      }

      const updated = { ...prev, examHistory };
      persistProfile(updated);
      return updated;
    });
  }, [persistProfile]);

  // Remove exam from history
  const removeExamHistory = useCallback((examId: string) => {
    setProfile(prev => {
      if (!prev) return null;

      const examHistory = (prev.examHistory || []).filter(e => e.id !== examId);
      const updated = { ...prev, examHistory };
      persistProfile(updated);
      return updated;
    });
  }, [persistProfile]);

  // Clear profile completely
  const clearProfile = useCallback(() => {
    setProfile(null);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }, []);

  return {
    profile,
    isLoading,
    hasProfile: !!profile,
    updateProfile,
    saveProfile,
    addExamHistory,
    removeExamHistory,
    clearProfile
  };
}

export default useProfile;
