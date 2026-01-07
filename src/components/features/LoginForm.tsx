/**
 * Login Form Component
 * Form đăng nhập cho người dùng
 */

import React, { useState } from 'react';
import { LogIn, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login, isLoading, error } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim()) {
      setLocalError('Vui lòng nhập tên đăng nhập');
      return;
    }

    if (!password) {
      setLocalError('Vui lòng nhập mật khẩu');
      return;
    }

    const result = await login(username.trim(), password);
    if (!result.success) {
      setLocalError(result.error || 'Đăng nhập thất bại');
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Đăng nhập
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2">
          Chào mừng bạn trở lại VanHoc10 AI
        </p>
      </div>

      {displayError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{displayError}</span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Tên đăng nhập"
          type="text"
          placeholder="Nhập tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<User className="w-5 h-5" />}
          autoComplete="username"
          disabled={isLoading}
        />

        <Input
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-accent transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          autoComplete="current-password"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isLoading}
        leftIcon={<LogIn className="w-5 h-5" />}
      >
        Đăng nhập
      </Button>

      <div className="text-center">
        <p className="text-stone-500 dark:text-stone-400">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-accent hover:underline font-semibold"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
