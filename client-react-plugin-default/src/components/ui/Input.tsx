/**
 * 通用输入框组件
 */

import React from 'react';

interface IInputProps {
  type?: 'text' | 'password' | 'email' | 'tel' | 'number' | 'datetime-local';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  className?: string;
  fullWidth?: boolean;
}

/**
 * 输入框组件
 */
export const Input: React.FC<IInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  maxLength,
  className = '',
  fullWidth = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200';
  const sizeClasses = 'min-h-[44px] text-sm';
  const stateClasses = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-primary-500';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = `
    ${baseClasses}
    ${sizeClasses}
    ${stateClasses}
    ${disabledClasses}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={classes}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};