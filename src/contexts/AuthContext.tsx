/**
 * Auth Context
 * Quản lý trạng thái xác thực người dùng
 * Người dùng chỉ cần username/password, không cần cấu hình gì
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, AuthState, SignupData, UserProfile } from '../../types';
import {
  getStoredAuthUser,
  signupUser,
  loginUser,
  logoutUser as logoutUserService,
  updateUserProfile
} from '../../services/githubStorageService';

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      setIsLoading(true);
      try {
        const storedUser = getStoredAuthUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(username, password);

      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }

      setError(result.error || 'Đăng nhập thất bại');
      return { success: false, error: result.error };
    } catch (err) {
      const errorMsg = 'Đã xảy ra lỗi khi đăng nhập';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Signup
  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signupUser(data);

      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }

      setError(result.error || 'Đăng ký thất bại');
      return { success: false, error: result.error };
    } catch (err) {
      const errorMsg = 'Đã xảy ra lỗi khi đăng ký';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    logoutUserService();
    setUser(null);
    setError(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profile: UserProfile): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const success = await updateUserProfile(user.username, profile);
      if (success) {
        setUser(prev => prev ? { ...prev, profile } : null);
      }
      return success;
    } catch {
      return false;
    }
  }, [user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
