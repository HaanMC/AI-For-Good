import React from 'react';
import { FileQuestion, SearchX, Inbox, AlertCircle } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'error' | 'inbox';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className = ''
}) => {
  const defaultIcons = {
    default: <FileQuestion className="w-12 h-12" />,
    search: <SearchX className="w-12 h-12" />,
    error: <AlertCircle className="w-12 h-12" />,
    inbox: <Inbox className="w-12 h-12" />
  };

  const iconColors = {
    default: 'text-stone-300 dark:text-stone-600',
    search: 'text-amber-400 dark:text-amber-500',
    error: 'text-red-400 dark:text-red-500',
    inbox: 'text-stone-300 dark:text-stone-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className={`mb-4 ${iconColors[variant]}`}>
        {icon || defaultIcons[variant]}
      </div>
      <h3 className="text-lg font-bold text-stone-700 dark:text-stone-300 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button onClick={action.onClick} variant="primary">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="ghost">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
