import React from 'react';
import {
  BookOpen,
  MessageSquare,
  GraduationCap,
  BookA,
  PenTool,
  Users,
  Layers,
  Brain,
  Calendar,
  UserCircle2,
  Settings2,
  Sun,
  Moon,
  Contrast,
  History,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AppMode } from '../../types';
import { IconButton, Avatar, Badge, Toggle } from '../ui';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isOpen: boolean;
  onToggle: () => void;
  userName?: string;
  isDarkMode: boolean;
  isHighContrast: boolean;
  onToggleTheme: () => void;
  onToggleHighContrast: () => void;
  onShowHistory: () => void;
  chatHistoryCount?: number;
}

interface NavItem {
  mode: AppMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  color?: string;
}

const navItems: NavItem[] = [
  { mode: AppMode.StudyChat, label: 'Trò Chuyện', icon: MessageSquare, color: 'text-blue-500' },
  { mode: AppMode.ExamGenerator, label: 'Luyện Thi', icon: GraduationCap, color: 'text-amber-500' },
  { mode: AppMode.WritingWorkshop, label: 'Luyện Viết', icon: PenTool, color: 'text-emerald-500' },
  { mode: AppMode.Dictionary, label: 'Từ Điển', icon: BookA, color: 'text-purple-500' },
  { mode: AppMode.Roleplay, label: 'Nhập Vai', icon: Users, color: 'text-rose-500' },
  { mode: AppMode.Flashcard, label: 'Flashcard', icon: Layers, color: 'text-cyan-500' },
  { mode: AppMode.Mindmap, label: 'Mindmap', icon: Brain, color: 'text-indigo-500' },
  { mode: AppMode.StudyPlan, label: 'Kế Hoạch', icon: Calendar, color: 'text-orange-500' },
];

const Sidebar: React.FC<SidebarProps> = ({
  currentMode,
  onModeChange,
  isOpen,
  onToggle,
  userName,
  isDarkMode,
  isHighContrast,
  onToggleTheme,
  onToggleHighContrast,
  onShowHistory,
  chatHistoryCount = 0
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-full z-50
          w-72 bg-white dark:bg-stone-900
          border-r border-stone-200 dark:border-stone-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:w-64
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-bold text-stone-800 dark:text-stone-100 font-serif">
                  AI Văn Học
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Lớp 10
                </p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 md:hidden"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>
        </div>

        {/* User Profile Quick Access */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800">
          <button
            onClick={() => onModeChange(AppMode.StudentProfile)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl transition-all
              ${currentMode === AppMode.StudentProfile
                ? 'bg-accent/10 text-accent'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800'
              }
            `}
          >
            <Avatar name={userName} size="sm" />
            <div className="flex-1 text-left min-w-0">
              <p className="font-medium text-sm text-stone-800 dark:text-stone-100 truncate">
                {userName || 'Chưa đặt tên'}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Hồ sơ học tập
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.mode;

            return (
              <button
                key={item.mode}
                onClick={() => {
                  onModeChange(item.mode);
                  if (window.innerWidth < 768) onToggle();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-left font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant={isActive ? 'default' : 'primary'} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
          {/* Chat History */}
          <button
            onClick={onShowHistory}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <History className="w-5 h-5" />
            <span className="flex-1 text-left text-sm font-medium">Lịch sử chat</span>
            {chatHistoryCount > 0 && (
              <Badge variant="default" size="sm">{chatHistoryCount}</Badge>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => onModeChange(AppMode.Settings)}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors
              ${currentMode === AppMode.Settings
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }
            `}
          >
            <Settings2 className="w-5 h-5" />
            <span className="flex-1 text-left text-sm font-medium">Cài đặt</span>
          </button>

          {/* Theme Toggles */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <IconButton
                icon={isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                onClick={onToggleTheme}
                variant="ghost"
                size="sm"
                tooltip={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              />
              <IconButton
                icon={<Contrast className="w-4 h-4" />}
                onClick={onToggleHighContrast}
                variant="ghost"
                size="sm"
                active={isHighContrast}
                tooltip="Tương phản cao"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
