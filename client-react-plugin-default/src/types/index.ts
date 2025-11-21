/**
 * 任务数据类型定义
 */

// 任务优先级
export type Priority = 'high' | 'medium' | 'low';

// 任务状态
export type TaskStatus = 'pending' | 'completed';

// 任务数据接口
export interface ITask {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  deadline?: string;
  createdAt: string;
  completedAt?: string;
}

// 筛选类型
export type FilterType = 'all' | 'pending' | 'completed';

// 排序类型
export type SortType = 'newest' | 'deadline' | 'priority';

// 提醒设置接口
export interface IReminderSettings {
  enabled: boolean;
  lastCheckTime: string;
}

// 统计数据接口
export interface IStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  priorityStats: {
    high: { total: number; completed: number };
    medium: { total: number; completed: number };
    low: { total: number; completed: number };
  };
  dailyStats: Array<{
    date: string;
    added: number;
    completed: number;
  }>;
}

// 应用设置接口
export interface IAppSettings {
  reminderSettings: IReminderSettings;
  theme: 'light' | 'dark';
}

// 提醒事件接口
export interface IReminderEvent {
  taskId: string;
  taskTitle: string;
  deadline: string;
  type: 'upcoming' | 'due' | 'overdue';
}