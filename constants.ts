/**
 * Application constants and configuration values
 * Centralized configuration for easy maintenance
 */

// File upload limits
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_MB = 10;

// Chat history limits
export const MAX_CHAT_SESSIONS = 50;

// Exam configuration
export const PENALTY_PER_VIOLATION = 0.5; // Points deducted per exam rule violation
export const MAX_PENALTY_POINTS = 10; // Maximum total penalty

// Dictionary cache configuration
export const DICTIONARY_CACHE_EXPIRATION_DAYS = 7;
export const DICTIONARY_CACHE_KEY = 'literary_dictionary_cache';

// localStorage keys
export const STORAGE_KEYS = {
  PROFILE: 'vanhoc10_profile',
  CHAT_HISTORY: 'vanhoc10_chat_history',
  THEME: 'theme',
  HIGH_CONTRAST: 'highContrast',
  DICTIONARY_CACHE: 'literary_dictionary_cache',
} as const;

// Task queue configuration
export const TASK_QUEUE = {
  MAX_CONCURRENT: 1,
  MAX_CONCURRENT_LIMIT: 10,
  MAX_BACKGROUND_CONCURRENT: 2,
} as const;

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY_MS: 1000,
  MAX_DELAY_MS: 8000,
  // Extended thinking (preview model) has stricter rate limits
  EXTENDED_THINKING_MAX_RETRIES: 5,
  EXTENDED_THINKING_BASE_DELAY_MS: 8000,
  RATE_LIMIT_BASE_DELAY_MS: 3000,
  RATE_LIMIT_MAX_DELAY_MS: 120000, // 2 minutes cap
} as const;

// Auto-save configuration
export const AUTO_SAVE_DELAY_MS = 2000;

// UI configuration
export const SIDEBAR_BREAKPOINT = 768; // md breakpoint in pixels
