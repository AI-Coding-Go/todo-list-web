/**
 * 通用按钮组件
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface IButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: IconDefinition;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
}

/**
 * 按钮组件
 */
export const Button: React.FC<IButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
}) => {
  // 基础样式
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // 尺寸样式
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  };

  // 变体样式
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400',
  };

  // 完整样式类名
  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // 图标渲染
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <FontAwesomeIcon 
        icon={icon} 
        className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}
      />
    );
  };

  // 内容渲染
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          {children && <span className="ml-2">{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          {children && <span className="ml-2">{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children && <span className="mr-2">{children}</span>}
          {renderIcon()}
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {renderContent()}
    </button>
  );
};