import React, { createContext, useContext, ReactNode } from 'react';
import { useProfile } from '../hooks/useProfile';
import { UserProfile, ExamHistory } from '../../types';

interface ProfileContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  hasProfile: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveProfile: (profile: UserProfile) => void;
  addExamHistory: (exam: ExamHistory) => void;
  removeExamHistory: (examId: string) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

/**
 * Profile Provider Component
 * Wraps the app to provide user profile state and controls
 */
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const profileState = useProfile();

  return (
    <ProfileContext.Provider value={profileState}>
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * Hook to access profile context
 * @throws Error if used outside ProfileProvider
 */
export function useProfileContext(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileContext;
