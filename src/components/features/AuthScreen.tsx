/**
 * Auth Screen Component
 * Màn hình xác thực chính - kết hợp Login, Signup và GitHub Config
 */

import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { useAuthContext } from '../../contexts';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import GitHubConfigForm from './GitHubConfigForm';

type AuthView = 'config' | 'login' | 'signup';

const AuthScreen: React.FC = () => {
  const { isConfigured, isLoading } = useAuthContext();
  const [currentView, setCurrentView] = useState<AuthView>(isConfigured ? 'login' : 'config');

  // Show loading spinner during initial load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500 dark:text-stone-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If not configured, show config form
  const showConfig = !isConfigured && currentView === 'config';

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-accent rounded-xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              VanHoc10 AI
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Trợ lý học Văn thông minh
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl shadow-stone-900/10 dark:shadow-black/30 p-8 border border-stone-200 dark:border-stone-700">
            {showConfig ? (
              <GitHubConfigForm onConfigured={() => setCurrentView('login')} />
            ) : currentView === 'login' ? (
              <LoginForm onSwitchToSignup={() => setCurrentView('signup')} />
            ) : (
              <SignupForm onSwitchToLogin={() => setCurrentView('login')} />
            )}
          </div>

          {/* Footer info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Dữ liệu được lưu trữ an toàn trên GitHub
            </p>
            {isConfigured && currentView !== 'config' && (
              <button
                onClick={() => setCurrentView('config')}
                className="mt-2 text-xs text-stone-400 dark:text-stone-500 hover:text-accent transition-colors"
              >
                Thay đổi cấu hình GitHub
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AuthScreen;
