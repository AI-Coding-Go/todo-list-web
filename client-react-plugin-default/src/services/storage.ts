/**
 * 本地存储服务
 */

import type { ITask, IAppSettings, IReminderEvent } from '../types';
import { STORAGE_KEYS } from '../constants';
import { deepClone } from '../utils';

/**
 * 存储服务类
 */
class StorageService {
  /**
   * 获取任务列表
   */
  getTasks(): ITask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取任务列表失败:', error);
      return [];
    }
  }

  /**
   * 保存任务列表
   */
  saveTasks(tasks: ITask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('保存任务列表失败:', error);
    }
  }

  /**
   * 添加任务
   */
  addTask(task: ITask): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  /**
   * 更新任务
   */
  updateTask(taskId: string, updates: Partial<ITask>): boolean {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === taskId);
    
    if (index === -1) return false;
    
    tasks[index] = { ...tasks[index], ...updates };
    this.saveTasks(tasks);
    return true;
  }

  /**
   * 删除任务
   */
  deleteTask(taskId: string): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    
    if (filteredTasks.length === tasks.length) return false;
    
    this.saveTasks(filteredTasks);
    return true;
  }

  /**
   * 获取应用设置
   */
  getSettings(): IAppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        // 返回默认设置
        const defaultSettings: IAppSettings = {
          reminderSettings: {
            enabled: true,
            lastCheckTime: new Date().toISOString(),
          },
          theme: 'light',
        };
        this.saveSettings(defaultSettings);
        return defaultSettings;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('获取设置失败:', error);
      return {
        reminderSettings: {
          enabled: true,
          lastCheckTime: new Date().toISOString(),
        },
        theme: 'light',
      };
    }
  }

  /**
   * 保存应用设置
   */
  saveSettings(settings: IAppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }

  /**
   * 获取提醒事件
   */
  getReminderEvents(): IReminderEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDER_EVENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取提醒事件失败:', error);
      return [];
    }
  }

  /**
   * 保存提醒事件
   */
  saveReminderEvents(events: IReminderEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDER_EVENTS, JSON.stringify(events));
    } catch (error) {
      console.error('保存提醒事件失败:', error);
    }
  }

  /**
   * 添加提醒事件
   */
  addReminderEvent(event: IReminderEvent): void {
    const events = this.getReminderEvents();
    events.push(event);
    this.saveReminderEvents(events);
  }

  /**
   * 清除提醒事件
   */
  clearReminderEvents(): void {
    this.saveReminderEvents([]);
  }

  /**
   * 清除所有数据
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.REMINDER_EVENTS);
    } catch (error) {
      console.error('清除数据失败:', error);
    }
  }
}

// 导出单例实例
export const storageService = new StorageService();