import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    active:scale-[0.98]
  `;

  const variants = {
    primary: `
      bg-accent text-white
      hover:bg-accent/90
      focus:ring-accent/50
      shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30
    `,
    secondary: `
      bg-stone-100 dark:bg-stone-800
      text-stone-700 dark:text-stone-200
      hover:bg-stone-200 dark:hover:bg-stone-700
      focus:ring-stone-400/50
      border border-stone-200 dark:border-stone-700
    `,
    ghost: `
      bg-transparent
      text-stone-600 dark:text-stone-400
      hover:bg-stone-100 dark:hover:bg-stone-800
      hover:text-stone-900 dark:hover:text-stone-100
      focus:ring-stone-400/50
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
      focus:ring-red-500/50
      shadow-lg shadow-red-500/25
    `,
    success: `
      bg-emerald-500 text-white
      hover:bg-emerald-600
      focus:ring-emerald-500/50
      shadow-lg shadow-emerald-500/25
    `,
    outline: `
      bg-transparent border-2 border-accent text-accent
      hover:bg-accent hover:text-white
      focus:ring-accent/50
    `
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  return (
    <button
      ref={ref}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
