/**
 * 加载动画组件
 */

import React from 'react';

interface ILoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

/**
 * 加载动画组件
 */
export const LoadingSpinner: React.FC<ILoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  // 尺寸样式
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  // 颜色样式
  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white',
  };

  const classes = [
    sizeClasses[size],
    colorClasses[color],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`
        animate-spin rounded-full border-2 border-t-transparent
        ${classes}
      `}
    />
  );
};