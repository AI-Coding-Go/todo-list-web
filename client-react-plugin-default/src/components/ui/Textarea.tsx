/**
 * 通用文本域组件
 */

import React from 'react';

interface ITextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
  fullWidth?: boolean;
}

/**
 * 文本域组件
 */
export const Textarea: React.FC<ITextareaProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  maxLength,
  rows = 4,
  className = '',
  fullWidth = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none';
  const stateClasses = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-primary-500';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = `
    ${baseClasses}
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
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={classes}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};