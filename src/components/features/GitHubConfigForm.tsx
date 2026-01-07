/**
 * GitHub Config Form Component
 * Form cấu hình GitHub để lưu trữ dữ liệu người dùng
 */

import React, { useState } from 'react';
import { Github, Key, FolderGit2, GitBranch, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useAuthContext } from '../../contexts';
import { GitHubConfig } from '../../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface GitHubConfigFormProps {
  onConfigured: () => void;
}

const GitHubConfigForm: React.FC<GitHubConfigFormProps> = ({ onConfigured }) => {
  const { setGitHubConfig, isLoading, error } = useAuthContext();
  const [config, setConfig] = useState<GitHubConfig>({
    owner: '',
    repo: '',
    branch: 'main',
    userDataPath: 'users-data',
    token: ''
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!config.owner.trim()) {
      setLocalError('Vui lòng nhập tên người dùng/tổ chức GitHub');
      return;
    }
    if (!config.repo.trim()) {
      setLocalError('Vui lòng nhập tên repository');
      return;
    }
    if (!config.token.trim()) {
      setLocalError('Vui lòng nhập Personal Access Token');
      return;
    }

    const success = await setGitHubConfig({
      ...config,
      owner: config.owner.trim(),
      repo: config.repo.trim(),
      branch: config.branch.trim() || 'main',
      userDataPath: config.userDataPath.trim() || 'users-data'
    });

    if (success) {
      onConfigured();
    }
  };

  const updateField = (field: keyof GitHubConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const displayError = localError || error;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 mb-4">
          <Github className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Cấu hình GitHub Storage
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2">
          Kết nối với GitHub để lưu trữ dữ liệu người dùng
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">Hướng dẫn tạo Token:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-600 dark:text-blue-400">
              <li>Truy cập GitHub Settings → Developer settings → Personal access tokens</li>
              <li>Chọn "Generate new token (classic)"</li>
              <li>Cấp quyền: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">repo</code> (Full control)</li>
              <li>Sao chép token và dán vào ô bên dưới</li>
            </ol>
          </div>
        </div>
      </div>

      {displayError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên người dùng / Tổ chức"
          type="text"
          placeholder="username hoặc org-name"
          value={config.owner}
          onChange={(e) => updateField('owner', e.target.value)}
          leftIcon={<Github className="w-5 h-5" />}
          disabled={isLoading}
        />

        <Input
          label="Tên Repository"
          type="text"
          placeholder="my-app-data"
          value={config.repo}
          onChange={(e) => updateField('repo', e.target.value)}
          leftIcon={<FolderGit2 className="w-5 h-5" />}
          hint="Repository này sẽ lưu trữ dữ liệu người dùng"
          disabled={isLoading}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Branch"
            type="text"
            placeholder="main"
            value={config.branch}
            onChange={(e) => updateField('branch', e.target.value)}
            leftIcon={<GitBranch className="w-5 h-5" />}
            disabled={isLoading}
          />

          <Input
            label="Thư mục lưu trữ"
            type="text"
            placeholder="users-data"
            value={config.userDataPath}
            onChange={(e) => updateField('userDataPath', e.target.value)}
            leftIcon={<FolderGit2 className="w-5 h-5" />}
            disabled={isLoading}
          />
        </div>

        <Input
          label="Personal Access Token"
          type={showToken ? 'text' : 'password'}
          placeholder="ghp_xxxxxxxxxxxx"
          value={config.token}
          onChange={(e) => updateField('token', e.target.value)}
          leftIcon={<Key className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="text-stone-400 hover:text-accent transition-colors"
            >
              {showToken ? 'Ẩn' : 'Hiện'}
            </button>
          }
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          leftIcon={<CheckCircle2 className="w-5 h-5" />}
        >
          Xác nhận cấu hình
        </Button>
      </form>
    </div>
  );
};

export default GitHubConfigForm;
