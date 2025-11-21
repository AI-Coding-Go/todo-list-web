/**
 * 任务项组件
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTrash, faClock } from '@fortawesome/free-solid-svg-icons';
import type { ITask } from '../../types';
import { Button } from '../ui/Button';
import { getPriorityColor, getPriorityLabel, formatDateTime, isOverdue, truncateText } from '../../utils';

interface ITaskItemProps {
  task: ITask;
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onView: (task: ITask) => void;
}

/**
 * 任务项组件
 */
export const TaskItem: React.FC<ITaskItemProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
}) => {
  const [showActions, setShowActions] = useState(false);
  const isTaskOverdue = isOverdue(task);
  const isCompleted = task.status === 'completed';

  // 处理复选框点击
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus(task.id);
  };

  // 处理任务项点击
  const handleTaskClick = () => {
    onView(task);
  };

  // 处理编辑按钮点击
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
    setShowActions(false);
  };

  // 处理删除按钮点击
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('确定删除该任务？删除后不可恢复');
    if (confirmed) {
      onDelete(task.id);
      setShowActions(false);
    }
  };

  // 处理长按显示操作菜单
  const handleLongPress = () => {
    setShowActions(true);
  };

  let pressTimer: ReturnType<typeof setTimeout>;
  const handleMouseDown = () => {
    pressTimer = setTimeout(handleLongPress, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer);
  };

  const handleTouchStart = () => {
    pressTimer = setTimeout(handleLongPress, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3
        transition-all duration-200 hover:shadow-md
        ${isCompleted ? 'opacity-60' : ''}
        ${showActions ? 'ring-2 ring-primary-500' : ''}
      `}
      onClick={handleTaskClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-start space-x-3">
        {/* 复选框 */}
        <button
          onClick={handleCheckboxClick}
          className={`
            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-200 mt-0.5
            ${isCompleted 
              ? 'bg-primary-600 border-primary-600' 
              : 'border-gray-300 hover:border-primary-500'
            }
          `}
        >
          {isCompleted && (
            <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
          )}
        </button>

        {/* 任务内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {/* 优先级标签 */}
            <span
              className="inline-block px-2 py-0.5 text-xs font-medium text-white rounded"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {getPriorityLabel(task.priority)}
            </span>

            {/* 截止时间 */}
            {task.deadline && (
              <div className={`
                flex items-center text-xs
                ${isTaskOverdue && !isCompleted ? 'text-red-600 font-medium' : 'text-gray-500'}
              `}>
                <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                <span>
                  {formatDateTime(task.deadline)}
                  {isTaskOverdue && !isCompleted && ' 逾期'}
                </span>
              </div>
            )}
          </div>

          {/* 任务标题 */}
          <h3 className={`
            text-sm font-medium text-gray-900 break-words
            ${isCompleted ? 'line-through' : ''}
          `}>
            {truncateText(task.title, 50)}
          </h3>

          {/* 任务描述（如果有） */}
          {task.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {truncateText(task.description, 100)}
            </p>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-1 bg-white rounded-lg shadow-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            className="p-2"
          >
            <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};