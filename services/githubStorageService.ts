/**
 * GitHub Storage Service
 * Lưu trữ và quản lý thông tin người dùng trực tiếp trên GitHub repo hiện tại
 * Sử dụng token của app (từ env variable), người dùng không cần cung cấp token
 */

import { AuthUser, SignupData, GitHubConfig, UserProfile, ChatSession, ExamHistory } from '../types';

// App's GitHub configuration - token từ environment variable
const APP_GITHUB_CONFIG: GitHubConfig = {
  owner: 'HaanMC',
  repo: 'AI-For-Good',
  branch: 'main',
  userDataPath: 'users-data',
  token: process.env.GITHUB_TOKEN || ''
};

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

// Get the app's GitHub config
export function getGitHubConfig(): GitHubConfig {
  return APP_GITHUB_CONFIG;
}

// Check if GitHub is configured (has token from env)
export function isGitHubConfigured(): boolean {
  return !!APP_GITHUB_CONFIG.token;
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
  options: RequestInit = {}
): Promise<Response> {
  const url = `https://api.github.com${endpoint}`;
  const headers: HeadersInit = {
    'Authorization': `Bearer ${APP_GITHUB_CONFIG.token}`,
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
async function getFileContent(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const { owner, repo, branch } = APP_GITHUB_CONFIG;
    const response = await githubAPI(
      `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
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
  sha?: string
): Promise<boolean> {
  try {
    const { owner, repo, branch } = APP_GITHUB_CONFIG;
    const body: Record<string, string> = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await githubAPI(
      `/repos/${owner}/${repo}/contents/${path}`,
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
function getUserFilePath(username: string): string {
  return `${APP_GITHUB_CONFIG.userDataPath}/${username.toLowerCase()}.json`;
}

// User data structure stored on GitHub
interface StoredUserData {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: number;
  lastLoginAt: number;
  profile?: UserProfile;
  chatHistory?: ChatSession[];
  examHistory?: ExamHistory[];
}

// Check if username exists
export async function checkUsernameExists(username: string): Promise<boolean> {
  const filePath = getUserFilePath(username);
  const result = await getFileContent(filePath);
  return result !== null;
}

// Sign up new user
export async function signupUser(
  data: SignupData
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (!APP_GITHUB_CONFIG.token) {
    return { success: false, error: 'Hệ thống chưa được cấu hình. Vui lòng liên hệ quản trị viên.' };
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
    const userData: StoredUserData = {
      ...user,
      passwordHash: simpleHash(data.password),
      chatHistory: [],
      examHistory: []
    };

    const filePath = getUserFilePath(data.username);
    const saved = await saveFileContent(
      filePath,
      JSON.stringify(userData, null, 2),
      `Create user: ${data.username}`
    );

    if (!saved) {
      return { success: false, error: 'Không thể tạo tài khoản. Vui lòng thử lại.' };
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
  if (!APP_GITHUB_CONFIG.token) {
    return { success: false, error: 'Hệ thống chưa được cấu hình. Vui lòng liên hệ quản trị viên.' };
  }

  try {
    const filePath = getUserFilePath(username);
    const result = await getFileContent(filePath);

    if (!result) {
      return { success: false, error: 'Tên đăng nhập không tồn tại' };
    }

    const userData: StoredUserData = JSON.parse(result.content);

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
    const updatedData: StoredUserData = {
      ...userData,
      lastLoginAt: now
    };

    await saveFileContent(
      filePath,
      JSON.stringify(updatedData, null, 2),
      `Login: ${username}`,
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
  if (!APP_GITHUB_CONFIG.token) {
    return false;
  }

  try {
    const filePath = getUserFilePath(username);
    const result = await getFileContent(filePath);

    if (!result) {
      return false;
    }

    const userData: StoredUserData = JSON.parse(result.content);
    userData.profile = profile;

    const saved = await saveFileContent(
      filePath,
      JSON.stringify(userData, null, 2),
      `Update profile: ${username}`,
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

// Save user's chat history to GitHub
export async function saveUserChatHistory(
  username: string,
  chatHistory: ChatSession[]
): Promise<boolean> {
  if (!APP_GITHUB_CONFIG.token) {
    return false;
  }

  try {
    const filePath = getUserFilePath(username);
    const result = await getFileContent(filePath);

    if (!result) {
      return false;
    }

    const userData: StoredUserData = JSON.parse(result.content);
    userData.chatHistory = chatHistory;

    return await saveFileContent(
      filePath,
      JSON.stringify(userData, null, 2),
      `Update chat history: ${username}`,
      result.sha
    );
  } catch (error) {
    console.error('Save chat history error:', error);
    return false;
  }
}

// Save user's exam history to GitHub
export async function saveUserExamHistory(
  username: string,
  examHistory: ExamHistory[]
): Promise<boolean> {
  if (!APP_GITHUB_CONFIG.token) {
    return false;
  }

  try {
    const filePath = getUserFilePath(username);
    const result = await getFileContent(filePath);

    if (!result) {
      return false;
    }

    const userData: StoredUserData = JSON.parse(result.content);
    userData.examHistory = examHistory;

    return await saveFileContent(
      filePath,
      JSON.stringify(userData, null, 2),
      `Update exam history: ${username}`,
      result.sha
    );
  } catch (error) {
    console.error('Save exam history error:', error);
    return false;
  }
}

// Get user's full data from GitHub
export async function getUserFullData(username: string): Promise<StoredUserData | null> {
  if (!APP_GITHUB_CONFIG.token) {
    return null;
  }

  try {
    const filePath = getUserFilePath(username);
    const result = await getFileContent(filePath);

    if (!result) {
      return null;
    }

    return JSON.parse(result.content);
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
}

// Logout user
export function logoutUser(): void {
  clearAuthUserLocally();
}
