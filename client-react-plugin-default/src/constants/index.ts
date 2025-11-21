/**
 * 应用常量定义
 */

// 本地存储键名
export const STORAGE_KEYS = {
  TASKS: 'todo_tasks',
  SETTINGS: 'todo_settings',
  REMINDER_EVENTS: 'todo_reminder_events',
} as const;

// 优先级配置
export const PRIORITY_CONFIG = {
  high: {
    label: '高',
    color: '#ef4444',
    value: 3,
  },
  medium: {
    label: '中',
    color: '#f59e0b',
    value: 2,
  },
  low: {
    label: '低',
    color: '#10b981',
    value: 1,
  },
} as const;

// 筛选选项
export const FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '未完成' },
  { value: 'completed', label: '已完成' },
] as const;

// 排序选项
export const SORT_OPTIONS = [
  { value: 'newest', label: '最新添加' },
  { value: 'deadline', label: '即将截止' },
  { value: 'priority', label: '优先级' },
] as const;

// 提醒时间配置（分钟）
export const REMINDER_TIMES = {
  UPCOMING: 30, // 截止前30分钟
  OVERDUE_INTERVAL: 24 * 60, // 逾期后每24小时
  MAX_REMINDERS: 3, // 最多提醒3次
} as const;

// 日期时间格式
export const DATE_FORMATS = {
  DATETIME: 'YYYY-MM-DD HH:mm',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  SHORT_DATETIME: 'MM-DD HH:mm',
  DISPLAY_DATETIME: 'MM月DD日 HH:mm',
} as const;

// 移动端断点
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
} as const;