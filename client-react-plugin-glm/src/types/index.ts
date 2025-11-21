/**
 * 类型定义文件
 */

// 任务优先级
export type Priority = 'high' | 'medium' | 'low'

// 任务状态
export type TodoStatus = 'pending' | 'completed'

// 任务对象
export interface ITodo {
  id: string
  title: string
  description: string
  dueDate?: string
  priority: Priority
  status: TodoStatus
  createdAt: string
  completedAt?: string
}

// 筛选类型
export type FilterType = 'all' | 'pending' | 'completed'

// 排序类型
export type SortType = 'createdAt' | 'dueDate' | 'priority'

// 提醒类型
export interface IReminder {
  id: string
  todoId: string
  type: 'before30min' | 'dueTime' | 'overdue'
  triggered: boolean
  createdAt: string
}

// 统计数据
export interface IStatistics {
  total: number
  completed: number
  pending: number
  overdue: number
  completionRate: number
  byPriority: {
    high: { total: number; completed: number }
    medium: { total: number; completed: number }
    low: { total: number; completed: number }
  }
  dailyTrend: Array<{
    date: string
    created: number
    completed: number
  }>
}

// 应用设置
export interface ISettings {
  enableReminder: boolean
  darkMode: boolean
}