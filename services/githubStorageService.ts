/**
 * GitHub Storage Service
 * Lưu trữ và quản lý thông tin người dùng trực tiếp trên GitHub repo hiện tại
 */

import { AuthUser, SignupData, GitHubConfig, UserProfile } from '../types';

// Default GitHub configuration - sử dụng repo hiện tại
const APP_GITHUB_CONFIG: GitHubConfig = {
  owner: 'HaanMC',
  repo: 'AI-For-Good',
  branch: 'main',
  userDataPath: 'users-data',
  token: (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) || ''
};

const AUTH_USER_KEY = 'vanhoc10_auth_user';
const GITHUB_TOKEN_KEY = 'vanhoc10_github_token';

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

// Get the app's GitHub config
export function getGitHubConfig(): GitHubConfig {
  // Check localStorage for token first
  const storedToken = localStorage.getItem(GITHUB_TOKEN_KEY);
  if (storedToken) {
    return { ...APP_GITHUB_CONFIG, token: storedToken };
  }
  return APP_GITHUB_CONFIG;
}

// Set GitHub token (saved to localStorage)
export function setGitHubToken(token: string): void {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
}

// Check if GitHub is configured (has token)
export function isGitHubConfigured(): boolean {
  const config = getGitHubConfig();
  return !!config.token;
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
export async function checkUsernameExists(username: string): Promise<boolean> {
  const config = getGitHubConfig();
  const filePath = getUserFilePath(username, config);
  const result = await getFileContent(filePath, config);
  return result !== null;
}

// Sign up new user
export async function signupUser(
  data: SignupData
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const config = getGitHubConfig();

  if (!config.token) {
    return { success: false, error: 'Chưa cấu hình GitHub Token' };
  }

  try {
    // Check if username already exists
    const exists = await checkUsernameExists(data.username);
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
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const config = getGitHubConfig();

  if (!config.token) {
    return { success: false, error: 'Chưa cấu hình GitHub Token' };
  }

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
  profile: UserProfile
): Promise<boolean> {
  const config = getGitHubConfig();

  if (!config.token) {
    return false;
  }

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

// Verify GitHub token is valid
export async function verifyGitHubToken(token: string): Promise<boolean> {
  try {
    const config = { ...APP_GITHUB_CONFIG, token };
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
export async function initializeUsersFolder(): Promise<boolean> {
  const config = getGitHubConfig();

  if (!config.token) {
    return false;
  }

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
