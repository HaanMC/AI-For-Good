/**
 * Signup Form Component
 * Form đăng ký tài khoản mới
 */

import React, { useState } from 'react';
import { UserPlus, User, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthContext } from '../../contexts';
import { SignupData } from '../../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signup, isLoading, error } = useAuthContext();
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
    displayName: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (!formData.displayName.trim()) {
      return 'Vui lòng nhập họ tên';
    }
    if (!formData.username.trim()) {
      return 'Vui lòng nhập tên đăng nhập';
    }
    if (formData.username.length < 3) {
      return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }
    if (!formData.email.trim()) {
      return 'Vui lòng nhập email';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Email không hợp lệ';
    }
    if (!formData.password) {
      return 'Vui lòng nhập mật khẩu';
    }
    if (formData.password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const result = await signup({
      ...formData,
      username: formData.username.trim().toLowerCase(),
      email: formData.email.trim(),
      displayName: formData.displayName.trim()
    });

    if (!result.success) {
      setLocalError(result.error || 'Đăng ký thất bại');
    }
  };

  const updateField = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const displayError = localError || error;

  const passwordStrength = formData.password.length >= 8
    ? 'strong'
    : formData.password.length >= 6
      ? 'medium'
      : 'weak';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Đăng ký tài khoản
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2">
          Tạo tài khoản để lưu trữ tiến trình học tập
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
          label="Họ và tên"
          type="text"
          placeholder="Nguyễn Văn A"
          value={formData.displayName}
          onChange={(e) => updateField('displayName', e.target.value)}
          leftIcon={<User className="w-5 h-5" />}
          disabled={isLoading}
        />

        <Input
          label="Tên đăng nhập"
          type="text"
          placeholder="nguyen_van_a"
          value={formData.username}
          onChange={(e) => updateField('username', e.target.value.toLowerCase())}
          leftIcon={<User className="w-5 h-5" />}
          hint="Chỉ chứa chữ cái, số và dấu gạch dưới"
          autoComplete="username"
          disabled={isLoading}
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          leftIcon={<Mail className="w-5 h-5" />}
          autoComplete="email"
          disabled={isLoading}
        />

        <div>
          <Input
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ít nhất 6 ký tự"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
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
            autoComplete="new-password"
            disabled={isLoading}
          />
          {formData.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passwordStrength === 'strong'
                      ? 'w-full bg-emerald-500'
                      : passwordStrength === 'medium'
                        ? 'w-2/3 bg-yellow-500'
                        : 'w-1/3 bg-red-500'
                  }`}
                />
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength === 'strong'
                  ? 'text-emerald-500'
                  : passwordStrength === 'medium'
                    ? 'text-yellow-500'
                    : 'text-red-500'
              }`}>
                {passwordStrength === 'strong' ? 'Mạnh' : passwordStrength === 'medium' ? 'Trung bình' : 'Yếu'}
              </span>
            </div>
          )}
        </div>

        <Input
          label="Xác nhận mật khẩu"
          type={showPassword ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            confirmPassword && formData.password === confirmPassword ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : null
          }
          autoComplete="new-password"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        variant="success"
        isLoading={isLoading}
        leftIcon={<UserPlus className="w-5 h-5" />}
      >
        Đăng ký
      </Button>

      <div className="text-center">
        <p className="text-stone-500 dark:text-stone-400">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-accent hover:underline font-semibold"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
