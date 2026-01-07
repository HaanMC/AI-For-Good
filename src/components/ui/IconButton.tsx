import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  tooltip?: string;
  active?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  className = '',
  variant = 'default',
  size = 'md',
  isLoading = false,
  tooltip,
  active = false,
  disabled,
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    active:scale-95
  `;

  const variants = {
    default: `
      bg-stone-100 dark:bg-stone-800
      text-stone-600 dark:text-stone-400
      hover:bg-stone-200 dark:hover:bg-stone-700
      hover:text-stone-900 dark:hover:text-stone-100
      focus:ring-stone-400/50
      ${active ? 'bg-accent/10 text-accent hover:bg-accent/20' : ''}
    `,
    ghost: `
      bg-transparent
      text-stone-500 dark:text-stone-400
      hover:bg-stone-100 dark:hover:bg-stone-800
      hover:text-stone-700 dark:hover:text-stone-200
      focus:ring-stone-400/50
      ${active ? 'text-accent bg-accent/10' : ''}
    `,
    outline: `
      bg-transparent
      border border-stone-300 dark:border-stone-600
      text-stone-600 dark:text-stone-400
      hover:bg-stone-100 dark:hover:bg-stone-800
      hover:border-stone-400 dark:hover:border-stone-500
      focus:ring-stone-400/50
      ${active ? 'border-accent text-accent' : ''}
    `,
    danger: `
      bg-red-100 dark:bg-red-900/30
      text-red-600 dark:text-red-400
      hover:bg-red-200 dark:hover:bg-red-900/50
      focus:ring-red-400/50
    `
  };

  const sizes = {
    xs: 'w-6 h-6 [&>svg]:w-3 [&>svg]:h-3',
    sm: 'w-8 h-8 [&>svg]:w-4 [&>svg]:h-4',
    md: 'w-10 h-10 [&>svg]:w-5 [&>svg]:h-5',
    lg: 'w-12 h-12 [&>svg]:w-6 [&>svg]:h-6'
  };

  return (
    <button
      ref={ref}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      title={tooltip}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        icon
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
