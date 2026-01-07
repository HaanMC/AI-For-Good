import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AppMode } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  userName?: string;
  isDarkMode: boolean;
  isHighContrast: boolean;
  onToggleTheme: () => void;
  onToggleHighContrast: () => void;
  isFastMode: boolean;
  onToggleFastMode: () => void;
  onShowHistory: () => void;
  chatHistoryCount?: number;
  onRefresh?: () => void;
  isLoading?: boolean;
  hideHeader?: boolean;
  showModeToggle?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentMode,
  onModeChange,
  userName,
  isDarkMode,
  isHighContrast,
  onToggleTheme,
  onToggleHighContrast,
  isFastMode,
  onToggleFastMode,
  onShowHistory,
  chatHistoryCount = 0,
  onRefresh,
  isLoading = false,
  hideHeader = false,
  showModeToggle = true
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-screen flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentMode={currentMode}
        onModeChange={onModeChange}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        userName={userName}
        isDarkMode={isDarkMode}
        isHighContrast={isHighContrast}
        onToggleTheme={onToggleTheme}
        onToggleHighContrast={onToggleHighContrast}
        onShowHistory={onShowHistory}
        chatHistoryCount={chatHistoryCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          currentMode={currentMode}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          isFastMode={isFastMode}
          onToggleFastMode={onToggleFastMode}
          onRefresh={onRefresh}
          isLoading={isLoading}
          showModeToggle={showModeToggle}
          hidden={hideHeader}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
