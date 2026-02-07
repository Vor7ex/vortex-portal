'use client';

import type { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = `
    px-4 py-2
    font-retro text-xs
    uppercase
    transition-shadow duration-200
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-phosphorescent focus:ring-offset-2 focus:ring-offset-black
  `;
  
  const variantStyles = {
    primary: `
      bg-black
      border-2 border-phosphorescent
      text-phosphorescent
      hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]
      disabled:hover:shadow-none
    `,
    secondary: `
      bg-transparent
      border-2 border-phosphorescent-alt
      text-phosphorescent-alt
      hover:bg-phosphorescent-alt hover:text-black
      disabled:hover:bg-transparent disabled:hover:text-phosphorescent-alt
    `,
    danger: `
      bg-black
      border-2 border-red-500
      text-red-500
      hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]
      disabled:hover:shadow-none
    `,
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
