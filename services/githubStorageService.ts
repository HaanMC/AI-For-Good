/**
 * GitHub Storage Service
 * Lưu trữ và quản lý thông tin người dùng trực tiếp trên GitHub
 */

import { AuthUser, SignupData, GitHubConfig, UserProfile } from '../types';

// Default GitHub configuration
const DEFAULT_GITHUB_CONFIG: Partial<GitHubConfig> = {
  branch: 'main',
  userDataPath: 'users-data'
};

// Storage key for GitHub config
const GITHUB_CONFIG_KEY = 'vanhoc10_github_config';
const AUTH_USER_KEY = 'vanhoc10_auth_user';

// Simple hash function for password (NOT secure - for demo purposes only)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// Get GitHub config from localStorage
export function getGitHubConfig(): GitHubConfig | null {
  try {
    const stored = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch {
    return null;
  }
}

// Save GitHub config to localStorage
export function saveGitHubConfig(config: GitHubConfig): void {
  localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
}

// Get stored auth user from localStorage
export function getStoredAuthUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch {
    return null;
  }
}

// Save auth user to localStorage
export function saveAuthUserLocally(user: AuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Clear auth user from localStorage
export function clearAuthUserLocally(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

// GitHub API helper
async function githubAPI(
  endpoint: string,
  config: GitHubConfig,
  options: RequestInit = {}
): Promise<Response> {
  const url = `https://api.github.com${endpoint}`;
  const headers: HeadersInit = {
    'Authorization': `Bearer ${config.token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  return fetch(url, {
    ...options,
    headers
  });
}

// Get file content from GitHub
async function getFileContent(
  path: string,
  config: GitHubConfig
): Promise<{ content: string; sha: string } | null> {
  try {
    const response = await githubAPI(
      `/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`,
      config
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = atob(data.content);
    return { content, sha: data.sha };
  } catch (error) {
    console.error('Error getting file from GitHub:', error);
    return null;
  }
}

// Create or update file on GitHub
async function saveFileContent(
  path: string,
  content: string,
  message: string,
  config: GitHubConfig,
  sha?: string
): Promise<boolean> {
  try {
    const body: Record<string, string> = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: config.branch
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await githubAPI(
      `/repos/${config.owner}/${config.repo}/contents/${path}`,
      config,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error saving file to GitHub:', error);
    return false;
  }
}

// Generate user file path
function getUserFilePath(username: string, config: GitHubConfig): string {
  return `${config.userDataPath}/${username.toLowerCase()}.json`;
}

// Check if username exists
export async function checkUsernameExists(
  username: string,
  config: GitHubConfig
): Promise<boolean> {
  const filePath = getUserFilePath(username, config);
  const result = await getFileContent(filePath, config);
  return result !== null;
}

// Sign up new user
export async function signupUser(
  data: SignupData,
  config: GitHubConfig
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    // Check if username already exists
    const exists = await checkUsernameExists(data.username, config);
    if (exists) {
      return { success: false, error: 'Tên đăng nhập đã tồn tại' };
    }

    // Create new user
    const now = Date.now();
    const user: AuthUser = {
      id: `user_${now}_${Math.random().toString(36).substr(2, 9)}`,
      username: data.username.toLowerCase(),
      email: data.email,
      displayName: data.displayName,
      createdAt: now,
      lastLoginAt: now
    };

    // Store user data with hashed password
    const userData = {
      ...user,
      passwordHash: simpleHash(data.password)
    };

    const filePath = getUserFilePath(data.username, config);
    const saved = await saveFileContent(
      filePath,
      JSON.stringify(userData, null, 2),
      `Create user: ${data.username}`,
      config
    );

    if (!saved) {
      return { success: false, error: 'Không thể lưu thông tin người dùng' };
    }

    // Save user locally
    saveAuthUserLocally(user);

    return { success: true, user };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Đã xảy ra lỗi khi đăng ký' };
  }
}

// Login user
export async function loginUser(
  username: string,
  password: string,
  config: GitHubConfig
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const filePath = getUserFilePath(username, config);
    const result = await getFileContent(filePath, config);

    if (!result) {
      return { success: false, error: 'Tên đăng nhập không tồn tại' };
    }

    const userData = JSON.parse(result.content);

    // Check password
    if (userData.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Mật khẩu không đúng' };
    }

    // Update last login time
    const now = Date.now();
    const user: AuthUser = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      displayName: userData.displayName,
      createdAt: userData.createdAt,
      lastLoginAt: now,
      profile: userData.profile
    };

    // Update user data on GitHub
    const updatedData = {
      ...userData,
      lastLoginAt: now
    };

    await saveFileContent(
      filePath,
      JSON.stringify(updatedData, null, 2),
      `Update login time: ${username}`,
      config,
      result.sha
    );

    // Save user locally
    saveAuthUserLocally(user);

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Đã xảy ra lỗi khi đăng nhập' };
  }
}

// Update user profile on GitHub
export async function updateUserProfile(
  username: string,
  profile: UserProfile,
  config: GitHubConfig
): Promise<boolean> {
  try {
    const filePath = getUserFilePath(username, config);
    const result = await getFileContent(filePath, config);

    if (!result) {
      return false;
    }

    const userData = JSON.parse(result.content);
    userData.profile = profile;

    const saved = await saveFileContent(
      filePath,
      JSON.stringify(userData, null, 2),
      `Update profile: ${username}`,
      config,
      result.sha
    );

    if (saved) {
      // Update local storage
      const storedUser = getStoredAuthUser();
      if (storedUser) {
        storedUser.profile = profile;
        saveAuthUserLocally(storedUser);
      }
    }

    return saved;
  } catch (error) {
    console.error('Update profile error:', error);
    return false;
  }
}

// Logout user
export function logoutUser(): void {
  clearAuthUserLocally();
}

// Verify GitHub config is valid
export async function verifyGitHubConfig(config: GitHubConfig): Promise<boolean> {
  try {
    const response = await githubAPI(
      `/repos/${config.owner}/${config.repo}`,
      config
    );
    return response.ok;
  } catch {
    return false;
  }
}

// Initialize users-data folder if not exists
export async function initializeUsersFolder(config: GitHubConfig): Promise<boolean> {
  try {
    // Check if folder exists by trying to get its contents
    const response = await githubAPI(
      `/repos/${config.owner}/${config.repo}/contents/${config.userDataPath}?ref=${config.branch}`,
      config
    );

    if (response.status === 404) {
      // Create a .gitkeep file to initialize the folder
      const saved = await saveFileContent(
        `${config.userDataPath}/.gitkeep`,
        '# Users data folder\nThis folder stores user account data.',
        `Initialize ${config.userDataPath} folder`,
        config
      );
      return saved;
    }

    return response.ok;
  } catch {
    return false;
  }
}
