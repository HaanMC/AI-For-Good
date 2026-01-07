import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
} = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick
}) => {
  const variants = {
    default: `
      bg-white dark:bg-stone-800
      border border-stone-200 dark:border-stone-700
      shadow-sm
    `,
    elevated: `
      bg-white dark:bg-stone-800
      shadow-lg shadow-stone-200/50 dark:shadow-stone-900/50
    `,
    outlined: `
      bg-transparent
      border-2 border-stone-200 dark:border-stone-700
    `,
    filled: `
      bg-stone-50 dark:bg-stone-900
      border border-stone-100 dark:border-stone-800
    `
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  };

  const hoverStyles = hover
    ? 'cursor-pointer hover:shadow-md hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200'
    : '';

  return (
    <div
      className={`
        rounded-2xl overflow-hidden
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  icon,
  action
}) => (
  <div className={`flex items-center gap-3 mb-4 ${className}`}>
    {icon && (
      <div className="p-2 bg-accent/10 text-accent rounded-xl">
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      {children}
    </div>
    {action && (
      <div className="flex-shrink-0">
        {action}
      </div>
    )}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = ''
}) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => (
  <div className={`mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
