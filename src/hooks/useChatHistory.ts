import { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message, Sender } from '../../types';
import { STORAGE_KEYS, MAX_CHAT_SESSIONS } from '../../constants';

interface UseChatHistoryReturn {
  chatHistory: ChatSession[];
  currentSession: ChatSession | null;
  saveSession: (messages: Message[], mode: 'study' | 'roleplay', characterId?: string) => void;
  loadSession: (sessionId: string) => ChatSession | null;
  deleteSession: (sessionId: string) => void;
  clearAllHistory: () => void;
  createNewSession: (mode: 'study' | 'roleplay', characterId?: string) => string;
  updateCurrentSession: (messages: Message[]) => void;
  getCurrentSessionId: () => string | null;
}

/**
 * Custom hook for managing chat history with localStorage persistence
 */
export function useChatHistory(): UseChatHistoryReturn {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by updatedAt descending (most recent first)
        parsed.sort((a: ChatSession, b: ChatSession) => b.updatedAt - a.updatedAt);
        setChatHistory(parsed);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  // Persist to localStorage
  const persistHistory = useCallback((history: ChatSession[]) => {
    try {
      // Keep only MAX_CHAT_SESSIONS sessions
      const trimmed = history.slice(0, MAX_CHAT_SESSIONS);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  // Generate session title from first user message
  const generateTitle = useCallback((messages: Message[]): string => {
    const firstUserMessage = messages.find(m => m.sender === Sender.User);
    if (firstUserMessage) {
      const text = firstUserMessage.text.trim();
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    return `Cuộc trò chuyện ${new Date().toLocaleDateString('vi-VN')}`;
  }, []);

  // Create new session
  const createNewSession = useCallback((mode: 'study' | 'roleplay', characterId?: string): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(sessionId);
    return sessionId;
  }, []);

  // Save or update session
  const saveSession = useCallback((
    messages: Message[],
    mode: 'study' | 'roleplay',
    characterId?: string
  ) => {
    if (messages.length === 0) return;

    const now = Date.now();
    const sessionId = currentSessionId || createNewSession(mode, characterId);

    const session: ChatSession = {
      id: sessionId,
      title: generateTitle(messages),
      messages,
      mode,
      characterId,
      createdAt: now,
      updatedAt: now
    };

    setChatHistory(prev => {
      // Check if session exists
      const existingIndex = prev.findIndex(s => s.id === sessionId);
      let updated: ChatSession[];

      if (existingIndex >= 0) {
        // Update existing session
        updated = [...prev];
        updated[existingIndex] = {
          ...session,
          createdAt: prev[existingIndex].createdAt // Keep original creation time
        };
      } else {
        // Add new session at the beginning
        updated = [session, ...prev];
      }

      // Sort by updatedAt
      updated.sort((a, b) => b.updatedAt - a.updatedAt);
      persistHistory(updated);
      return updated;
    });
  }, [currentSessionId, createNewSession, generateTitle, persistHistory]);

  // Update current session
  const updateCurrentSession = useCallback((messages: Message[]) => {
    if (!currentSessionId || messages.length === 0) return;

    setChatHistory(prev => {
      const index = prev.findIndex(s => s.id === currentSessionId);
      if (index < 0) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        messages,
        title: generateTitle(messages),
        updatedAt: Date.now()
      };

      updated.sort((a, b) => b.updatedAt - a.updatedAt);
      persistHistory(updated);
      return updated;
    });
  }, [currentSessionId, generateTitle, persistHistory]);

  // Load session by ID
  const loadSession = useCallback((sessionId: string): ChatSession | null => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
    }
    return session || null;
  }, [chatHistory]);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    setChatHistory(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      persistHistory(updated);
      return updated;
    });

    // Reset current session if deleted
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId, persistHistory]);

  // Clear all history
  const clearAllHistory = useCallback(() => {
    setChatHistory([]);
    setCurrentSessionId(null);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  }, []);

  // Get current session
  const currentSession = currentSessionId
    ? chatHistory.find(s => s.id === currentSessionId) || null
    : null;

  return {
    chatHistory,
    currentSession,
    saveSession,
    loadSession,
    deleteSession,
    clearAllHistory,
    createNewSession,
    updateCurrentSession,
    getCurrentSessionId: () => currentSessionId
  };
}

export default useChatHistory;
