/**
 * 提醒条组件
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClock, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { IReminderEvent } from '../../types';
import { Button } from '../ui/Button';
import { formatDateTime } from '../../utils';

interface IReminderBarProps {
  reminder: IReminderEvent;
  onView: (taskId: string) => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

/**
 * 提醒条组件
 */
export const ReminderBar: React.FC<IReminderBarProps> = ({
  reminder,
  onView,
  onSnooze,
  onDismiss,
}) => {
  // 获取提醒类型样式
  const getReminderTypeStyle = () => {
    switch (reminder.type) {
      case 'upcoming':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'due':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'overdue':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  // 获取提醒类型文本
  const getReminderTypeText = () => {
    switch (reminder.type) {
      case 'upcoming':
        return '即将到期';
      case 'due':
        return '已到期';
      case 'overdue':
        return '已逾期';
      default:
        return '提醒';
    }
  };

  return (
    <div className={`
      fixed top-14 left-4 right-4 z-50
      border rounded-lg p-3 shadow-lg slide-up
      ${getReminderTypeStyle()}
    `}>
      <div className="flex items-start space-x-3">
        {/* 图标 */}
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={faBell} className="w-5 h-5 mt-0.5" />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium">
              {getReminderTypeText()}
            </span>
            <div className="flex items-center text-xs">
              <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
              <span>{formatDateTime(reminder.deadline, 'MM-DD HH:mm')}</span>
            </div>
          </div>
          
          <p className="text-sm font-medium truncate">
            {reminder.taskTitle}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            icon={faEye}
            onClick={() => onView(reminder.taskId)}
            className="p-1.5 text-xs"
          >
            查看
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon={faClock}
            onClick={onSnooze}
            className="p-1.5 text-xs"
          >
            稍后
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon={faTimes}
            onClick={onDismiss}
            className="p-1.5 text-xs"
          />
        </div>
      </div>
    </div>
  );
};