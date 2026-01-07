import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AppMode, Message, ChatSession } from '../../types';
import { useChatHistory } from '../hooks/useChatHistory';

interface AppContextValue {
  // Current mode
  currentMode: AppMode;
  setCurrentMode: (mode: AppMode) => void;

  // Chat state
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  roleplayMessages: Message[];
  setRoleplayMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  // Chat history
  chatHistory: ChatSession[];
  saveSession: (messages: Message[], mode: 'study' | 'roleplay', characterId?: string) => void;
  loadSession: (sessionId: string) => ChatSession | null;
  deleteSession: (sessionId: string) => void;
  clearAllHistory: () => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Fast mode
  isFastMode: boolean;
  setIsFastMode: (fast: boolean) => void;
  toggleFastMode: () => void;

  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Show history modal
  showChatHistory: boolean;
  setShowChatHistory: (show: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Initial bot message
const INITIAL_MESSAGE: Message = {
  id: 'initial',
  text: "Chào em! Thầy là Trợ lý Văn học AI của em. Thầy có thể giúp em ôn tập, phân tích tác phẩm, luyện viết hoặc tạo đề thi thử. Em muốn bắt đầu từ đâu?",
  sender: 'bot' as const,
  timestamp: Date.now()
};

/**
 * App Provider Component
 * Provides global app state management
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Mode state
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.StudyChat);

  // Chat states
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [roleplayMessages, setRoleplayMessages] = useState<Message[]>([]);

  // Chat history management
  const {
    chatHistory,
    saveSession,
    loadSession,
    deleteSession,
    clearAllHistory
  } = useChatHistory();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Fast mode (default to fast for better UX)
  const [isFastMode, setIsFastMode] = useState(true);
  const toggleFastMode = useCallback(() => setIsFastMode(prev => !prev), []);

  // Sidebar state
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  // Chat history modal
  const [showChatHistory, setShowChatHistory] = useState(false);

  const value: AppContextValue = {
    currentMode,
    setCurrentMode,
    messages,
    setMessages,
    roleplayMessages,
    setRoleplayMessages,
    chatHistory,
    saveSession,
    loadSession,
    deleteSession,
    clearAllHistory,
    isLoading,
    setIsLoading,
    isFastMode,
    setIsFastMode,
    toggleFastMode,
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    showChatHistory,
    setShowChatHistory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook to access app context
 * @throws Error if used outside AppProvider
 */
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
