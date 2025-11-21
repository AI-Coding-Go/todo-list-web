/**
 * 空状态组件
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface IEmptyStateProps {
  icon?: IconDefinition;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * 空状态组件
 */
export const EmptyState: React.FC<IEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center py-12 px-4 text-center
      ${className}
    `}>
      {icon && (
        <div className="mb-4 text-gray-400">
          <FontAwesomeIcon icon={icon} className="w-12 h-12" />
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};