/**
 * App With Auth Wrapper
 * Component bọc App với AuthProvider và logic xác thực
 */

import React from 'react';
import { AuthProvider, useAuthContext } from './src/contexts';
import { AuthScreen } from './src/components/features';
import App from './App';

// Inner component that uses auth context
const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state
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

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Show main app if authenticated
  return <App />;
};

// Main wrapper component with provider
const AppWithAuth: React.FC = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default AppWithAuth;
