/**
 * 常量定义文件
 * 定义应用中使用的所有常量
 */

import type { ETaskPriority } from '@/types'

/** 优先级配置 */
export const PRIORITY_CONFIG: Record<ETaskPriority, { label: string; color: string }> = {
  high: { label: '高', color: '#ef4444' },
  medium: { label: '中', color: '#f59e0b' },
  low: { label: '低', color: '#22c55e' },
}

/** 任务筛选选项 */
export const FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '未完成' },
  { value: 'completed', label: '已完成' },
] as const

/** 任务排序选项 */
export const SORT_OPTIONS = [
  { value: 'latest', label: '最新添加' },
  { value: 'due', label: '即将截止' },
  { value: 'priority', label: '优先级' },
] as const

/** 底部导航项 */
export const BOTTOM_NAV_ITEMS = [
  { path: '/', label: '待办', icon: 'list' },
  { path: '/statistics', label: '统计', icon: 'chart' },
  { path: '/settings', label: '设置', icon: 'cog' },
]

/** 本地存储键名 */
export const STORAGE_KEYS = {
  TASKS: 'h5_todo_tasks',
  REMINDER_ENABLED: 'h5_todo_reminder_enabled',
  REMINDED_TASKS: 'h5_todo_remined_tasks',
} as const
