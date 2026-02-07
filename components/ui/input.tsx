'use client';

import type { InputHTMLAttributes, TextareaHTMLAttributes, ChangeEvent } from 'react';

interface BaseInputProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

interface TextInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  type: 'text' | 'number';
}

interface TextareaInputProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  type: 'textarea';
}

interface FileInputProps extends BaseInputProps {
  type: 'file';
  accept?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: never;
}

export type InputProps = TextInputProps | TextareaInputProps | FileInputProps;

export function Input({
  label,
  error,
  helperText,
  required = false,
  type,
  className = '',
  ...props
}: InputProps) {
  const id = `input-${Math.random().toString(36).substring(7)}`;
  
  const baseStyles = `
    w-full
    bg-black
    border-2
    ${error ? 'border-red-500' : 'border-phosphorescent'}
    ${error ? 'text-red-400' : 'text-phosphorescent'}
    font-pixel text-base
    p-2
    transition-shadow duration-200
    focus:outline-none
    ${error ? 'focus:shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'focus:shadow-[0_0_15px_rgba(0,255,0,0.4)]'}
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const labelStyles = `
    block
    font-retro text-xs
    ${error ? 'text-red-500' : 'text-phosphorescent'}
    mb-2
    uppercase
  `;

  const errorStyles = `
    mt-1
    font-pixel text-sm
    text-red-400
  `;

  const helperStyles = `
    mt-1
    font-pixel text-sm
    text-phosphorescent
    opacity-60
  `;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className={labelStyles}>
        {label}
        {required && <span className="ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          className={baseStyles}
          rows={4}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : type === 'file' ? (
        <input
          id={id}
          type="file"
          className={`${baseStyles} file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-phosphorescent file:text-black file:font-retro file:text-xs file:uppercase file:cursor-pointer`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={baseStyles}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      
      {error && <p className={errorStyles}>{error}</p>}
      {!error && helperText && <p className={helperStyles}>{helperText}</p>}
    </div>
  );
}
