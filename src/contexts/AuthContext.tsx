/**
 * Auth Context
 * Quản lý trạng thái xác thực người dùng
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, AuthState, SignupData, UserProfile } from '../../types';
import {
  getStoredAuthUser,
  signupUser,
  loginUser,
  logoutUser as logoutUserService,
  updateUserProfile,
  isGitHubConfigured,
  setGitHubToken,
  verifyGitHubToken,
  initializeUsersFolder
} from '../../services/githubStorageService';

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<boolean>;
  isConfigured: boolean;
  configureToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const configured = isGitHubConfigured();
        setIsConfigured(configured);

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

  // Configure GitHub token
  const configureToken = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Verify token is valid
      const isValid = await verifyGitHubToken(token);
      if (!isValid) {
        setError('Token không hợp lệ. Vui lòng kiểm tra lại.');
        return false;
      }

      // Save token
      setGitHubToken(token);
      setIsConfigured(true);

      // Initialize users folder
      await initializeUsersFolder();

      return true;
    } catch (err) {
      setError('Không thể kết nối đến GitHub');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isGitHubConfigured()) {
      return { success: false, error: 'Chưa cấu hình GitHub Token' };
    }

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
    if (!isGitHubConfigured()) {
      return { success: false, error: 'Chưa cấu hình GitHub Token' };
    }

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
    updateProfile,
    isConfigured,
    configureToken
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
