/**
 * 本地存储服务
 * 负责管理任务数据的本地存储操作
 */

import { Injectable } from '@angular/core';
import { ITask } from '../models/task.model';

/**
 * 存储键名常量
 */
const STORAGE_KEYS = {
  TASKS: 'todo_tasks',
  SETTINGS: 'todo_settings',
  REMINDERS: 'todo_reminders'
} as const;

/**
 * 设置接口
 */
export interface ISettings {
  /** 是否允许任务提醒 */
  enableReminders: boolean;
  /** 主题设置 */
  theme: 'light' | 'dark';
}

/**
 * 提醒记录接口
 */
export interface IReminderRecord {
  /** 任务ID */
  taskId: string;
  /** 提醒类型 */
  type: 'before' | 'due' | 'overdue';
  /** 提醒时间 */
  timestamp: number;
  /** 是否已处理 */
  handled: boolean;
}

/**
 * 默认设置
 */
const DEFAULT_SETTINGS: ISettings = {
  enableReminders: true,
  theme: 'light'
};

/**
 * 本地存储服务
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   * 获取所有任务
   */
  getTasks(): ITask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取任务数据失败:', error);
      return [];
    }
  }

  /**
   * 保存任务列表
   */
  saveTasks(tasks: ITask[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('保存任务数据失败:', error);
      return false;
    }
  }

  /**
   * 添加单个任务
   */
  addTask(task: ITask): boolean {
    try {
      const tasks = this.getTasks();
      tasks.push(task);
      return this.saveTasks(tasks);
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
      const tasks = this.getTasks();
      const index = tasks.findIndex(task => task.id === taskId);
      
      if (index === -1) {
        console.warn('任务不存在:', taskId);
        return false;
      }

      tasks[index] = { ...tasks[index], ...updates };
      return this.saveTasks(tasks);
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
      const tasks = this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      return this.saveTasks(filteredTasks);
    } catch (error) {
      console.error('删除任务失败:', error);
      return false;
    }
  }

  /**
   * 根据ID获取任务
   */
  getTaskById(taskId: string): ITask | null {
    try {
      const tasks = this.getTasks();
      return tasks.find(task => task.id === taskId) || null;
    } catch (error) {
      console.error('获取任务失败:', error);
      return null;
    }
  }

  /**
   * 清空所有任务
   */
  clearTasks(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      return true;
    } catch (error) {
      console.error('清空任务失败:', error);
      return false;
    }
  }

  /**
   * 获取设置
   */
  getSettings(): ISettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('获取设置失败:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * 保存设置
   */
  saveSettings(settings: Partial<ISettings>): boolean {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  }

  /**
   * 获取提醒记录
   */
  getReminderRecords(): IReminderRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取提醒记录失败:', error);
      return [];
    }
  }

  /**
   * 添加提醒记录
   */
  addReminderRecord(record: IReminderRecord): boolean {
    try {
      const records = this.getReminderRecords();
      records.push(record);
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error('添加提醒记录失败:', error);
      return false;
    }
  }

  /**
   * 标记提醒记录为已处理
   */
  markReminderHandled(taskId: string, type: string): boolean {
    try {
      const records = this.getReminderRecords();
      const updatedRecords = records.map(record => 
        (record.taskId === taskId && record.type === type)
          ? { ...record, handled: true }
          : record
      );
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updatedRecords));
      return true;
    } catch (error) {
      console.error('更新提醒记录失败:', error);
      return false;
    }
  }

  /**
   * 清理过期的提醒记录（保留7天内的记录）
   */
  cleanupExpiredReminders(): boolean {
    try {
      const records = this.getReminderRecords();
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const validRecords = records.filter(record => record.timestamp > sevenDaysAgo);
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(validRecords));
      return true;
    } catch (error) {
      console.error('清理提醒记录失败:', error);
      return false;
    }
  }

  /**
   * 导出数据
   */
  exportData(): string {
    try {
      const data = {
        tasks: this.getTasks(),
        settings: this.getSettings(),
        exportTime: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('导出数据失败:', error);
      return '';
    }
  }

  /**
   * 导入数据
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      // 验证数据格式
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('无效的数据格式');
      }

      // 导入任务数据
      if (data.tasks.length > 0) {
        this.saveTasks(data.tasks);
      }

      // 导入设置数据
      if (data.settings) {
        this.saveSettings(data.settings);
      }

      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }

  /**
   * 获取存储使用情况
   */
  getStorageInfo(): { used: number; available: number; tasks: number } {
    try {
      let used = 0;
      let tasks = 0;

      // 计算各部分数据大小
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          used += data.length;
          if (key === STORAGE_KEYS.TASKS) {
            tasks = JSON.parse(data).length;
          }
        }
      });

      // localStorage通常限制为5-10MB，这里按5MB计算
      const available = 5 * 1024 * 1024 - used;

      return { used, available, tasks };
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return { used: 0, available: 0, tasks: 0 };
    }
  }
}