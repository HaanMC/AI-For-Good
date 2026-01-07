/**
 * Auth Context
 * Quản lý trạng thái xác thực người dùng
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, AuthState, SignupData, GitHubConfig, UserProfile } from '../../types';
import {
  getGitHubConfig,
  saveGitHubConfig,
  getStoredAuthUser,
  signupUser,
  loginUser,
  logoutUser as logoutUserService,
  updateUserProfile,
  verifyGitHubConfig,
  initializeUsersFolder
} from '../../services/githubStorageService';

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<boolean>;
  githubConfig: GitHubConfig | null;
  setGitHubConfig: (config: GitHubConfig) => Promise<boolean>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubConfig, setGithubConfigState] = useState<GitHubConfig | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const storedConfig = getGitHubConfig();
        const storedUser = getStoredAuthUser();

        if (storedConfig) {
          setGithubConfigState(storedConfig);
        }

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

  // Set GitHub configuration
  const setGitHubConfig = useCallback(async (config: GitHubConfig): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Verify config is valid
      const isValid = await verifyGitHubConfig(config);
      if (!isValid) {
        setError('Cấu hình GitHub không hợp lệ. Vui lòng kiểm tra lại.');
        return false;
      }

      // Initialize users folder
      await initializeUsersFolder(config);

      // Save config
      saveGitHubConfig(config);
      setGithubConfigState(config);

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
    if (!githubConfig) {
      return { success: false, error: 'Chưa cấu hình GitHub' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(username, password, githubConfig);

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
  }, [githubConfig]);

  // Signup
  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    if (!githubConfig) {
      return { success: false, error: 'Chưa cấu hình GitHub' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signupUser(data, githubConfig);

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
  }, [githubConfig]);

  // Logout
  const logout = useCallback(() => {
    logoutUserService();
    setUser(null);
    setError(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profile: UserProfile): Promise<boolean> => {
    if (!githubConfig || !user) {
      return false;
    }

    try {
      const success = await updateUserProfile(user.username, profile, githubConfig);
      if (success) {
        setUser(prev => prev ? { ...prev, profile } : null);
      }
      return success;
    } catch {
      return false;
    }
  }, [githubConfig, user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    githubConfig,
    setGitHubConfig,
    isConfigured: !!githubConfig
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
