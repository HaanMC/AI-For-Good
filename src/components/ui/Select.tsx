import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className = '',
  label,
  error,
  hint,
  options,
  placeholder,
  selectSize = 'md',
  variant = 'default',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = `
    w-full rounded-xl transition-all duration-200 appearance-none cursor-pointer
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
    sm: 'px-3 py-2 pr-9 text-sm',
    md: 'px-4 py-2.5 pr-10 text-base',
    lg: 'px-5 py-3 pr-12 text-lg'
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            ${baseStyles}
            ${variants[variant]}
            ${sizes[selectSize]}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500 pointer-events-none" />
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

Select.displayName = 'Select';

export default Select;
