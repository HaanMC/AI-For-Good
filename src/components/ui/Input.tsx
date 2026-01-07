import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = 'default',
  inputSize = 'md',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = `
    w-full rounded-xl transition-all duration-200
    placeholder:text-stone-400 dark:placeholder:text-stone-500
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    default: `
      bg-white dark:bg-stone-800
      border border-stone-300 dark:border-stone-600
      text-stone-900 dark:text-stone-100
      hover:border-stone-400 dark:hover:border-stone-500
      focus:border-accent focus:ring-accent/20
    `,
    filled: `
      bg-stone-100 dark:bg-stone-900
      border-2 border-transparent
      text-stone-900 dark:text-stone-100
      hover:bg-stone-200 dark:hover:bg-stone-800
      focus:border-accent focus:ring-accent/20 focus:bg-white dark:focus:bg-stone-800
    `
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  const iconPadding = {
    sm: { left: 'pl-9', right: 'pr-9' },
    md: { left: 'pl-10', right: 'pr-10' },
    lg: { left: 'pl-12', right: 'pr-12' }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            ${baseStyles}
            ${variants[variant]}
            ${sizes[inputSize]}
            ${leftIcon ? iconPadding[inputSize].left : ''}
            ${rightIcon ? iconPadding[inputSize].right : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
