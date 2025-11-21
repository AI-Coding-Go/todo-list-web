/**
 * 通用选择器组件
 */

import React from 'react';

interface ISelectOption {
  value: string;
  label: string;
}

interface ISelectProps {
  value: string;
  onChange: (value: string) => void;
  options: ISelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  fullWidth?: boolean;
}

/**
 * 选择器组件
 */
export const Select: React.FC<ISelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  fullWidth = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[44px] text-sm';
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
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={classes}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};