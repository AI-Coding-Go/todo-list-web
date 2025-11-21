/**
 * 悬浮按钮组件
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/Button';

interface IFloatingButtonProps {
  onClick: () => void;
  icon?: any;
  className?: string;
}

/**
 * 悬浮按钮组件
 */
export const FloatingButton: React.FC<IFloatingButtonProps> = ({
  onClick,
  icon = faPlus,
  className = '',
}) => {
  return (
    <div className={`
      fixed bottom-20 right-4 z-30
      ${className}
    `}>
      <Button
        variant="primary"
        size="lg"
        icon={icon}
        onClick={onClick}
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      />
    </div>
  );
};