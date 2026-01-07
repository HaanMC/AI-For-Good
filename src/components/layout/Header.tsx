import React from 'react';
import {
  Menu,
  RefreshCw,
  Zap,
  Brain,
  MessageSquare,
  GraduationCap,
  BookA,
  PenTool,
  Users,
  Layers,
  Calendar,
  UserCircle2,
  Settings2
} from 'lucide-react';
import { AppMode } from '../../types';
import { IconButton, Toggle, Badge } from '../ui';

interface HeaderProps {
  currentMode: AppMode;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isFastMode: boolean;
  onToggleFastMode: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  showModeToggle?: boolean;
  hidden?: boolean;
}

const modeConfig: Record<AppMode, { label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  [AppMode.StudyChat]: {
    label: 'Trò Chuyện Học Tập',
    icon: MessageSquare,
    description: 'Hỏi đáp, thảo luận về văn học'
  },
  [AppMode.ExamGenerator]: {
    label: 'Luyện Thi',
    icon: GraduationCap,
    description: 'Tạo đề thi & chấm điểm'
  },
  [AppMode.WritingWorkshop]: {
    label: 'Xưởng Viết',
    icon: PenTool,
    description: 'Phân tích & cải thiện bài viết'
  },
  [AppMode.Dictionary]: {
    label: 'Từ Điển Văn Học',
    icon: BookA,
    description: 'Tra cứu thuật ngữ'
  },
  [AppMode.Roleplay]: {
    label: 'Nhập Vai Nhân Vật',
    icon: Users,
    description: 'Trò chuyện với nhân vật văn học'
  },
  [AppMode.Flashcard]: {
    label: 'Flashcard',
    icon: Layers,
    description: 'Học qua thẻ ghi nhớ'
  },
  [AppMode.Mindmap]: {
    label: 'Sơ Đồ Tư Duy',
    icon: Brain,
    description: 'Hệ thống hóa kiến thức'
  },
  [AppMode.StudyPlan]: {
    label: 'Kế Hoạch Học Tập',
    icon: Calendar,
    description: 'Lập lịch ôn tập 7 ngày'
  },
  [AppMode.StudentProfile]: {
    label: 'Hồ Sơ Học Sinh',
    icon: UserCircle2,
    description: 'Quản lý thông tin cá nhân'
  },
  [AppMode.Settings]: {
    label: 'Cài Đặt',
    icon: Settings2,
    description: 'Tùy chỉnh ứng dụng'
  }
};

const Header: React.FC<HeaderProps> = ({
  currentMode,
  isSidebarOpen,
  onToggleSidebar,
  isFastMode,
  onToggleFastMode,
  onRefresh,
  isLoading = false,
  showModeToggle = true,
  hidden = false
}) => {
  if (hidden) return null;

  const config = modeConfig[currentMode];
  const Icon = config.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <IconButton
            icon={<Menu className="w-5 h-5" />}
            onClick={onToggleSidebar}
            variant="ghost"
            className="md:hidden"
            tooltip="Menu"
          />

          {/* Mode Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl hidden sm:flex">
              <Icon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-bold text-stone-800 dark:text-stone-100 font-serif text-sm sm:text-base">
                {config.label}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fast/Deep Mode Toggle */}
          {showModeToggle && (currentMode === AppMode.StudyChat || currentMode === AppMode.Roleplay) && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <button
                onClick={() => isFastMode || onToggleFastMode()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isFastMode
                    ? 'bg-white dark:bg-stone-700 text-accent shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nhanh</span>
              </button>
              <button
                onClick={() => !isFastMode || onToggleFastMode()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  !isFastMode
                    ? 'bg-white dark:bg-stone-700 text-accent shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sâu</span>
              </button>
            </div>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <IconButton
              icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={onRefresh}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              tooltip="Làm mới"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
