/**
 * 工具函数集合
 */

import dayjs from './dayjs';
import type { ITask, Priority, TaskStatus, FilterType, SortType } from '../types';
import { PRIORITY_CONFIG, DATE_FORMATS } from '../constants';

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string | undefined, format: string = DATE_FORMATS.SHORT_DATETIME): string => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 判断任务是否逾期
 */
export const isOverdue = (task: ITask): boolean => {
  if (task.status === 'completed' || !task.deadline) return false;
  return dayjs().isAfter(dayjs(task.deadline));
};

/**
 * 获取优先级颜色
 */
export const getPriorityColor = (priority: Priority): string => {
  return PRIORITY_CONFIG[priority].color;
};

/**
 * 获取优先级标签
 */
export const getPriorityLabel = (priority: Priority): string => {
  return PRIORITY_CONFIG[priority].label;
};

/**
 * 截断文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 筛选任务
 */
export const filterTasks = (tasks: ITask[], filter: FilterType): ITask[] => {
  switch (filter) {
    case 'pending':
      return tasks.filter(task => task.status === 'pending');
    case 'completed':
      return tasks.filter(task => task.status === 'completed');
    default:
      return tasks;
  }
};

/**
 * 排序任务
 */
export const sortTasks = (tasks: ITask[], sortType: SortType): ITask[] => {
  const sorted = [...tasks];
  
  switch (sortType) {
    case 'newest':
      return sorted.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    
    case 'deadline':
      return sorted.sort((a, b) => {
        // 无截止时间的排在最后
        if (!a.deadline && !b.deadline) return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf();
      });
    
    case 'priority':
      return sorted.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (diff !== 0) return diff;
        // 同优先级按创建时间倒序
        return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
      });
    
    default:
      return sorted;
  }
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
};

/**
 * 深拷贝
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * 显示确认对话框
 */
export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.confirm(message)) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

/**
 * 显示提示消息
 */
export const showToast = (message: string, duration: number = 2000): void => {
  // 创建临时提示元素
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg z-50 fade-in';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration);
};