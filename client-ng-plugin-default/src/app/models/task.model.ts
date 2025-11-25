/**
 * 任务数据模型
 * 定义任务的基本结构和相关类型
 */

import dayjs from 'dayjs';

/**
 * 优先级枚举
 */
export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

/**
 * 任务接口定义
 */
export interface ITask {
  /** 任务唯一标识 */
  id: string;
  /** 任务标题 */
  title: string;
  /** 任务描述 */
  description?: string;
  /** 截止时间 */
  dueDate?: string;
  /** 优先级 */
  priority: Priority;
  /** 任务状态 */
  status: TaskStatus;
  /** 创建时间 */
  createdAt: string;
  /** 完成时间 */
  completedAt?: string;
}

/**
 * 任务统计接口
 */
export interface ITaskStats {
  /** 总任务数 */
  total: number;
  /** 已完成任务数 */
  completed: number;
  /** 未完成任务数 */
  pending: number;
  /** 高优先级任务数 */
  highPriority: number;
  /** 中优先级任务数 */
  mediumPriority: number;
  /** 低优先级任务数 */
  lowPriority: number;
  /** 逾期任务数 */
  overdue: number;
}

/**
 * 任务筛选类型
 */
export type TaskFilter = 'all' | 'pending' | 'completed';

/**
 * 任务排序类型
 */
export type TaskSort = 'newest' | 'dueDate' | 'priority';

/**
 * 任务工具类
 */
export class TaskUtils {
  /**
   * 创建新任务实例
   */
  static createTask(data: Partial<ITask>): ITask {
    return {
      id: this.generateId(),
      title: data.title || '',
      description: data.description || '',
      dueDate: data.dueDate,
      priority: data.priority || Priority.MEDIUM,
      status: TaskStatus.PENDING,
      createdAt: dayjs().toISOString(),
      completedAt: undefined,
      ...data
    };
  }

  /**
   * 生成唯一ID
   */
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 格式化截止时间显示
   */
  static formatDueDate(dueDate?: string): string {
    if (!dueDate) return '';
    return dayjs(dueDate).format('MM-DD HH:mm');
  }

  /**
   * 格式化创建时间显示
   */
  static formatCreatedAt(createdAt: string): string {
    return dayjs(createdAt).format('YYYY-MM-DD HH:mm');
  }

  /**
   * 检查任务是否逾期
   */
  static isOverdue(task: ITask): boolean {
    if (!task.dueDate || task.status === TaskStatus.COMPLETED) {
      return false;
    }
    return dayjs().isAfter(dayjs(task.dueDate));
  }

  /**
   * 获取优先级显示文本
   */
  static getPriorityText(priority: Priority): string {
    const map = {
      [Priority.HIGH]: '高',
      [Priority.MEDIUM]: '中',
      [Priority.LOW]: '低'
    };
    return map[priority] || '中';
  }

  /**
   * 获取状态显示文本
   */
  static getStatusText(status: TaskStatus): string {
    const map = {
      [TaskStatus.PENDING]: '未完成',
      [TaskStatus.COMPLETED]: '已完成'
    };
    return map[status] || '未完成';
  }

  /**
   * 截断任务标题
   */
  static truncateTitle(title: string, maxLength: number = 50): string {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  }

  /**
   * 任务排序函数
   */
  static sortTasks(tasks: ITask[], sortBy: TaskSort): ITask[] {
    const sorted = [...tasks];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => 
          dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );
      
      case 'dueDate':
        return sorted.sort((a, b) => {
          // 无截止时间的排在最后
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
        });
      
      case 'priority':
        const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
        return sorted.sort((a, b) => {
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          // 同优先级按创建时间倒序
          return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
        });
      
      default:
        return sorted;
    }
  }

  /**
   * 任务筛选函数
   */
  static filterTasks(tasks: ITask[], filter: TaskFilter): ITask[] {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => task.status === TaskStatus.PENDING);
      case 'completed':
        return tasks.filter(task => task.status === TaskStatus.COMPLETED);
      default:
        return tasks;
    }
  }

  /**
   * 计算任务统计信息
   */
  static calculateStats(tasks: ITask[]): ITaskStats {
    const stats: ITaskStats = {
      total: tasks.length,
      completed: 0,
      pending: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      overdue: 0
    };

    tasks.forEach(task => {
      // 状态统计
      if (task.status === TaskStatus.COMPLETED) {
        stats.completed++;
      } else {
        stats.pending++;
      }

      // 优先级统计
      switch (task.priority) {
        case Priority.HIGH:
          stats.highPriority++;
          break;
        case Priority.MEDIUM:
          stats.mediumPriority++;
          break;
        case Priority.LOW:
          stats.lowPriority++;
          break;
      }

      // 逾期统计
      if (this.isOverdue(task)) {
        stats.overdue++;
      }
    });

    return stats;
  }
}