/**
 * 任务服务
 * 负责任务的业务逻辑处理
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ITask, TaskFilter, TaskSort, TaskUtils, Priority, TaskStatus } from '../models/task.model';

/**
 * 任务服务
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /** 任务列表流 */
  private tasks$ = new BehaviorSubject<ITask[]>([]);
  
  /** 当前筛选条件 */
  private currentFilter: TaskFilter = 'all';
  
  /** 当前排序条件 */
  private currentSort: TaskSort = 'newest';

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  /**
   * 获取任务列表流
   */
  getTasks(): Observable<ITask[]> {
    return this.tasks$.asObservable();
  }

  /**
   * 获取筛选和排序后的任务列表
   */
  getFilteredAndSortedTasks(): ITask[] {
    const tasks = this.tasks$.value;
    const filtered = TaskUtils.filterTasks(tasks, this.currentFilter);
    return TaskUtils.sortTasks(filtered, this.currentSort);
  }

  /**
   * 获取当前筛选条件
   */
  getCurrentFilter(): TaskFilter {
    return this.currentFilter;
  }

  /**
   * 获取当前排序条件
   */
  getCurrentSort(): TaskSort {
    return this.currentSort;
  }

  /**
   * 设置筛选条件
   */
  setFilter(filter: TaskFilter): void {
    this.currentFilter = filter;
    // 重新发送更新事件以触发视图更新
    this.tasks$.next(this.tasks$.value);
  }

  /**
   * 设置排序条件
   */
  setSort(sort: TaskSort): void {
    this.currentSort = sort;
    // 重新发送更新事件以触发视图更新
    this.tasks$.next(this.tasks$.value);
  }

  /**
   * 加载任务数据
   */
  private loadTasks(): void {
    const tasks = this.storageService.getTasks();
    this.tasks$.next(tasks);
  }

  /**
   * 刷新任务数据
   */
  refreshTasks(): void {
    this.loadTasks();
  }

  /**
   * 添加任务
   */
  addTask(taskData: Partial<ITask>): boolean {
    try {
      const task = TaskUtils.createTask(taskData);
      const success = this.storageService.addTask(task);
      
      if (success) {
        this.refreshTasks();
      }
      
      return success;
    } catch (error) {
      console.error('添加任务失败:', error);
      return false;
    }
  }

  /**
   * 更新任务
   */
  updateTask(taskId: string, updates: Partial<ITask>): boolean {
    try {
      // 如果更新状态为完成，添加完成时间
      if (updates.status === TaskStatus.COMPLETED) {
        updates.completedAt = new Date().toISOString();
      } else if (updates.status === TaskStatus.PENDING) {
        updates.completedAt = undefined;
      }

      const success = this.storageService.updateTask(taskId, updates);
      
      if (success) {
        this.refreshTasks();
      }
      
      return success;
    } catch (error) {
      console.error('更新任务失败:', error);
      return false;
    }
  }

  /**
   * 删除任务
   */
  deleteTask(taskId: string): boolean {
    try {
      const success = this.storageService.deleteTask(taskId);
      
      if (success) {
        this.refreshTasks();
      }
      
      return success;
    } catch (error) {
      console.error('删除任务失败:', error);
      return false;
    }
  }

  /**
   * 根据ID获取任务
   */
  getTaskById(taskId: string): ITask | null {
    return this.storageService.getTaskById(taskId);
  }

  /**
   * 切换任务完成状态
   */
  toggleTaskStatus(taskId: string): boolean {
    const task = this.getTaskById(taskId);
    if (!task) {
      return false;
    }

    const newStatus = task.status === TaskStatus.COMPLETED 
      ? TaskStatus.PENDING 
      : TaskStatus.COMPLETED;

    return this.updateTask(taskId, { status: newStatus });
  }

  /**
   * 标记任务为完成
   */
  markTaskCompleted(taskId: string): boolean {
    return this.updateTask(taskId, { status: TaskStatus.COMPLETED });
  }

  /**
   * 标记任务为未完成
   */
  markTaskPending(taskId: string): boolean {
    return this.updateTask(taskId, { status: TaskStatus.PENDING });
  }

  /**
   * 批量删除已完成的任务
   */
  deleteCompletedTasks(): boolean {
    try {
      const tasks = this.tasks$.value;
      const completedTaskIds = tasks
        .filter(task => task.status === TaskStatus.COMPLETED)
        .map(task => task.id);

      let success = true;
      for (const taskId of completedTaskIds) {
        const result = this.storageService.deleteTask(taskId);
        if (!result) {
          success = false;
        }
      }

      if (success) {
        this.refreshTasks();
      }

      return success;
    } catch (error) {
      console.error('批量删除已完成任务失败:', error);
      return false;
    }
  }

  /**
   * 清空所有任务
   */
  clearAllTasks(): boolean {
    try {
      const success = this.storageService.clearTasks();
      
      if (success) {
        this.refreshTasks();
      }
      
      return success;
    } catch (error) {
      console.error('清空任务失败:', error);
      return false;
    }
  }

  /**
   * 搜索任务
   */
  searchTasks(keyword: string): ITask[] {
    const tasks = this.tasks$.value;
    
    if (!keyword.trim()) {
      return this.getFilteredAndSortedTasks();
    }

    const lowerKeyword = keyword.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerKeyword) ||
      (task.description && task.description.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * 获取任务统计信息
   */
  getTaskStats() {
    const tasks = this.tasks$.value;
    return TaskUtils.calculateStats(tasks);
  }

  /**
   * 获取今日任务
   */
  getTodayTasks(): ITask[] {
    const tasks = this.tasks$.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  }

  /**
   * 获取逾期任务
   */
  getOverdueTasks(): ITask[] {
    const tasks = this.tasks$.value;
    return tasks.filter(task => TaskUtils.isOverdue(task));
  }

  /**
   * 获取即将到期的任务（24小时内）
   */
  getUpcomingTasks(): ITask[] {
    const tasks = this.tasks$.value;
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return tasks.filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED) {
        return false;
      }
      const dueDate = new Date(task.dueDate);
      return dueDate > now && dueDate <= tomorrow;
    });
  }

  /**
   * 按优先级分组任务
   */
  getTasksByPriority(): { high: ITask[]; medium: ITask[]; low: ITask[] } {
    const tasks = this.tasks$.value;
    
    return {
      high: tasks.filter(task => task.priority === Priority.HIGH),
      medium: tasks.filter(task => task.priority === Priority.MEDIUM),
      low: tasks.filter(task => task.priority === Priority.LOW)
    };
  }

  /**
   * 获取最近7天的任务统计
   */
  getWeeklyStats(): { date: string; created: number; completed: number }[] {
    const tasks = this.tasks$.value;
    const stats: { date: string; created: number; completed: number }[] = [];
    
    // 生成最近7天的日期
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dateStr = date.toISOString().split('T')[0];
      
      const created = tasks.filter(task => {
        const createdDate = new Date(task.createdAt);
        return createdDate >= date && createdDate < nextDate;
      }).length;
      
      const completed = tasks.filter(task => {
        if (!task.completedAt) return 0;
        const completedDate = new Date(task.completedAt);
        return completedDate >= date && completedDate < nextDate;
      }).length;
      
      stats.push({ date: dateStr, created, completed });
    }
    
    return stats;
  }

  /**
   * 复制任务
   */
  duplicateTask(taskId: string): boolean {
    try {
      const originalTask = this.getTaskById(taskId);
      if (!originalTask) {
        return false;
      }

      const duplicatedTask: Partial<ITask> = {
        title: `${originalTask.title} (副本)`,
        description: originalTask.description,
        dueDate: originalTask.dueDate,
        priority: originalTask.priority
      };

      return this.addTask(duplicatedTask);
    } catch (error) {
      console.error('复制任务失败:', error);
      return false;
    }
  }

  /**
   * 导出任务数据
   */
  exportTasks(): string {
    return this.storageService.exportData();
  }

  /**
   * 导入任务数据
   */
  importTasks(jsonData: string): boolean {
    const success = this.storageService.importData(jsonData);
    
    if (success) {
      this.refreshTasks();
    }
    
    return success;
  }
}