/**
 * 页面头部组件
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCog } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/Button';

interface IHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: any;
    onClick: () => void;
  };
  className?: string;
}

/**
 * 页面头部组件
 */
export const Header: React.FC<IHeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  className = '',
}) => {
  return (
    <header className={`
      fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200
      ${className}
    `}>
      <div className="flex items-center justify-between h-14 px-4">
        {/* 左侧返回按钮 */}
        <div className="flex items-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              icon={faArrowLeft}
              onClick={onBack}
              className="p-2 mr-2"
            />
          )}
          <h1 className="text-lg font-semibold text-gray-900">
            {title}
          </h1>
        </div>

        {/* 右侧操作按钮 */}
        {rightAction && (
          <Button
            variant="ghost"
            size="sm"
            icon={rightAction.icon}
            onClick={rightAction.onClick}
            className="p-2"
          />
        )}
      </div>
    </header>
  );
};