/**
 * 提醒横幅组件
 */
import React, { useState, useEffect } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { useSettingsStore } from '@/store/settingsStore'
import { reminderStorage } from '@/utils/storage'
import { formatDateTime, generateId } from '@/utils/date'
import { ITodo, IReminder } from '@/types'

const ReminderBanner: React.FC = () => {
  const { todos } = useTodoStore()
  const { settings } = useSettingsStore()
  const [activeReminder, setActiveReminder] = useState<IReminder | null>(null)
  
  // 检查是否有需要提醒的任务
  useEffect(() => {
    if (!settings.enableReminder) return
    
    // 清理旧提醒
    reminderStorage.cleanupOldReminders()
    
    // 获取当前时间和提醒时间点
    const now = new Date()
    const checkReminders = () => {
      // 查找需要提醒的任务
      const todosNeedingReminder = todos.filter(todo => {
        // 只处理未完成且有截止时间的任务
        if (todo.status !== 'completed' || !todo.dueDate) return false
        
        const dueDate = new Date(todo.dueDate)
        const timeDiff = dueDate.getTime() - now.getTime()
        
        // 检查提醒条件：
        // 1. 截止前30分钟
        // 2. 截止时间
        // 3. 逾期后每24小时
        return timeDiff <= 30 * 60 * 1000 // 30分钟内
      })
      
      // 获取已存在的提醒
      const existingReminders = reminderStorage.getReminders()
      
      // 检查每个需要提醒的任务
      todosNeedingReminder.forEach(todo => {
        if (!todo.dueDate) return
        
        const dueDate = new Date(todo.dueDate)
        const timeDiff = dueDate.getTime() - now.getTime()
        const isOverdue = timeDiff < 0
        
        // 确定提醒类型
        let reminderType: 'before30min' | 'dueTime' | 'overdue' = 'before30min'
        
        if (isOverdue) {
          reminderType = 'overdue'
        } else if (timeDiff <= 0) {
          reminderType = 'dueTime'
        }
        
        // 检查是否已经触发过此类提醒
        const hasBeenTriggered = existingReminders.some(r => 
          r.todoId === todo.id && 
          r.type === reminderType && 
          r.triggered
        )
        
        // 如果没有触发过，创建新提醒
        if (!hasBeenTriggered) {
          const newReminder: IReminder = {
            id: generateId(),
            todoId: todo.id,
            type: reminderType,
            triggered: false,
            createdAt: new Date().toISOString(),
          }
          
          reminderStorage.addReminder(newReminder)
          
          // 如果没有当前活动提醒，设置这个为新提醒
          if (!activeReminder) {
            setActiveReminder(newReminder)
          }
        }
      })
    }
    
    // 立即检查一次
    checkReminders()
    
    // 每5分钟检查一次
    const interval = setInterval(checkReminders, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [todos, settings.enableReminder])
  
  // 获取任务详情
  const getReminderTodo = (): ITodo | null => {
    if (!activeReminder) return null
    return todos.find(todo => todo.id === activeReminder.todoId) || null
  }
  
  // 处理查看任务
  const handleViewTodo = () => {
    if (!activeReminder) return
    // 跳转到任务详情页
    window.location.href = `/todo/${activeReminder.todoId}`
  }
  
  // 处理稍后提醒
  const handleLater = () => {
    if (!activeReminder) return
    
    // 标记为已触发
    reminderStorage.markAsTriggered(activeReminder.id)
    setActiveReminder(null)
  }
  
  // 获取提醒文本
  const getReminderText = (): string => {
    const todo = getReminderTodo()
    if (!todo) return ''
    
    switch (activeReminder?.type) {
      case 'before30min':
        return `任务"${todo.title}"将在30分钟后到期`
      case 'dueTime':
        return `任务"${todo.title}"已到期`
      case 'overdue':
        return `任务"${todo.title}"已逾期`
      default:
        return `任务"${todo.title}"需要关注`
    }
  }
  
  // 获取截止时间文本
  const getDueTimeText = (): string => {
    const todo = getReminderTodo()
    if (!todo || !todo.dueDate) return ''
    
    return `截止时间: ${formatDateTime(todo.dueDate)}`
  }
  
  // 如果没有提醒或提醒关闭，不显示
  if (!activeReminder || !settings.enableReminder) return null
  
  const todo = getReminderTodo()
  if (!todo) return null
  
  return (
    <div className="fixed top-12 left-0 right-0 bg-yellow-50 border-l-4 border-yellow-400 p-3 z-30 safe-area-top">
      <div className="flex items-start">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-800">{getReminderText()}</h4>
          <p className="text-xs text-yellow-700 mt-1">{getDueTimeText()}</p>
        </div>
        <button
          onClick={() => setActiveReminder(null)}
          className="ml-2 text-yellow-600"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleViewTodo}
          className="px-3 py-1 bg-yellow-600 text-white text-xs rounded"
        >
          查看任务
        </button>
        <button
          onClick={handleLater}
          className="px-3 py-1 border border-yellow-600 text-yellow-600 text-xs rounded"
        >
          稍后提醒
        </button>
      </div>
    </div>
  )
}

export default ReminderBanner