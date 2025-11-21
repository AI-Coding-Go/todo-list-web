/**
 * 任务项组件
 */
import React, { useState } from 'react'
import { ITodo, Priority } from '@/types'
import { formatDateTime, isOverdue } from '@/utils/date'
import { useNavigate } from 'react-router-dom'
import clsx from 'classnames'

interface ITodoItemProps {
  todo: ITodo
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

const TodoItem: React.FC<ITodoItemProps> = ({ 
  todo, 
  onToggleStatus, 
  onDelete, 
  onEdit 
}) => {
  const navigate = useNavigate()
  const [showActions, setShowActions] = useState(false)
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)
  
  // 获取优先级对应的样式类
  const getPriorityClass = (priority: Priority): string => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return 'priority-medium'
    }
  }
  
  // 获取优先级标签文本
  const getPriorityLabel = (priority: Priority): string => {
    switch (priority) {
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return '中'
    }
  }
  
  // 处理任务项点击
  const handleTodoClick = () => {
    if (!showActions) {
      navigate(`/todo/${todo.id}`)
    }
  }
  
  // 处理复选框点击
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleStatus(todo.id)
  }
  
  // 处理操作按钮点击
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }
  
  // 处理触摸开始
  const handleTouchStart = () => {
    // 设置长按计时器
    const timer = setTimeout(() => {
      setShowActions(true)
    }, 500)
    setPressTimer(timer)
  }
  
  // 处理触摸结束
  const handleTouchEnd = () => {
    // 清除计时器
    if (pressTimer) {
      clearTimeout(pressTimer)
      setPressTimer(null)
    }
  }
  
  // 截止时间是否逾期
  const overdue = todo.dueDate && isOverdue(todo.dueDate) && todo.status === 'pending'
  
  // 截止时间显示文本
  const dueTimeText = todo.dueDate ? formatDateTime(todo.dueDate) : ''
  
  return (
    <div
      className={clsx(
        'bg-white border-b border-gray-100 px-4 py-3 relative',
        getPriorityClass(todo.priority),
        todo.status === 'completed' && 'bg-gray-50'
      )}
      onClick={handleTodoClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-start">
        {/* 复选框 */}
        <div className="mr-3 flex items-center pt-0.5">
          <input
            type="checkbox"
            checked={todo.status === 'completed'}
            onChange={() => {}}
            onClick={handleCheckboxClick}
            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
          />
        </div>
        
        {/* 任务内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            {/* 优先级标签 */}
            <span 
              className={clsx(
                'text-xs px-1.5 py-0.5 rounded mr-2',
                todo.priority === 'high' ? 'bg-red-100 text-red-600' :
                todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              )}
            >
              {getPriorityLabel(todo.priority)}
            </span>
            
            {/* 任务标题 */}
            <h3 
              className={clsx(
                'flex-1 text-sm font-medium truncate',
                todo.status === 'completed' && 'line-through text-gray-500'
              )}
            >
              {todo.title}
            </h3>
          </div>
          
          {/* 截止时间 */}
          {todo.dueDate && (
            <div className="flex items-center text-xs">
              <i className="far fa-clock mr-1"></i>
              <span className={clsx(
                overdue ? 'text-red-500 font-medium' : 'text-gray-500'
              )}>
                {dueTimeText}
                {overdue && ' (逾期)'}
              </span>
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        <div className="ml-2 flex items-center">
          <button
            className="w-8 h-8 flex items-center justify-center text-gray-400"
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
          >
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
      
      {/* 操作菜单 */}
      {showActions && (
        <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-1">
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center"
            onClick={(e) => handleActionClick(e, () => onEdit(todo.id))}
          >
            <i className="fas fa-edit mr-2 text-blue-500"></i>
            编辑
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center text-red-500"
            onClick={(e) => handleActionClick(e, () => onDelete(todo.id))}
          >
            <i className="fas fa-trash mr-2"></i>
            删除
          </button>
        </div>
      )}
      
      {/* 点击外部关闭操作菜单 */}
      {showActions && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowActions(false)}
        ></div>
      )}
    </div>
  )
}

export default TodoItem