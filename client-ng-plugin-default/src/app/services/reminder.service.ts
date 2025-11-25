/**
 * 提醒服务
 * 负责任务提醒功能的实现
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { StorageService, IReminderRecord } from './storage.service';
import { ITask, TaskUtils } from '../models/task.model';
import dayjs from 'dayjs';

/**
 * 提醒事件接口
 */
export interface IReminderEvent {
  /** 任务ID */
  taskId: string;
  /** 任务标题 */
  taskTitle: string;
  /** 提醒类型 */
  type: 'before' | 'due' | 'overdue';
  /** 提醒消息 */
  message: string;
  /** 截止时间 */
  dueDate?: string;
}

/**
 * 提醒服务
 */
@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  /** 提醒事件流 */
  private reminderEvents$ = new BehaviorSubject<IReminderEvent[]>([]);
  
  /** 当前活跃的提醒 */
  private activeReminders = new Map<string, IReminderEvent>();

  constructor(private storageService: StorageService) {
    this.startReminderCheck();
  }

  /**
   * 获取提醒事件流
   */
  getReminderEvents(): Observable<IReminderEvent[]> {
    return this.reminderEvents$.asObservable();
  }

  /**
   * 启动提醒检查
   */
  private startReminderCheck(): void {
    // 每分钟检查一次提醒
    interval(60000).pipe(
      startWith(0),
      switchMap(() => this.checkReminders())
    ).subscribe();
  }

  /**
   * 检查提醒
   */
  private async checkReminders(): Promise<void> {
    const settings = this.storageService.getSettings();
    
    if (!settings.enableReminders) {
      this.activeReminders.clear();
      this.reminderEvents$.next([]);
      return;
    }

    const tasks = this.storageService.getTasks();
    const reminderRecords = this.storageService.getReminderRecords();
    const newReminders: IReminderEvent[] = [];

    // 清理过期记录
    this.storageService.cleanupExpiredReminders();

    for (const task of tasks) {
      // 只对设置了截止时间且未完成的任务进行提醒
      if (!task.dueDate || task.status === 'completed') {
        continue;
      }

      const now = dayjs();
      const dueDate = dayjs(task.dueDate);
      const taskId = task.id;

      // 检查各种提醒类型
      const reminders = this.checkTaskReminders(task, now, dueDate, reminderRecords);
      
      for (const reminder of reminders) {
        const reminderKey = `${taskId}_${reminder.type}`;
        
        // 检查是否已经提醒过
        const isAlreadyReminded = reminderRecords.some(
          record => record.taskId === taskId && 
                   record.type === reminder.type && 
                   !record.handled
        );

        if (!isAlreadyReminded) {
          this.activeReminders.set(reminderKey, reminder);
          newReminders.push(reminder);

          // 记录提醒
          this.storageService.addReminderRecord({
            taskId,
            type: reminder.type,
            timestamp: Date.now(),
            handled: false
          });
        }
      }
    }

    // 更新提醒事件
    this.reminderEvents$.next(newReminders);

    // 发送浏览器通知
    if (newReminders.length > 0) {
      this.sendBrowserNotifications(newReminders);
    }
  }

  /**
   * 检查单个任务的提醒
   */
  private checkTaskReminders(
    task: ITask, 
    now: dayjs.Dayjs, 
    dueDate: dayjs.Dayjs,
    records: IReminderRecord[]
  ): IReminderEvent[] {
    const reminders: IReminderEvent[] = [];
    const taskId = task.id;

    // 1. 截止前30分钟提醒
    const before30Min = dueDate.subtract(30, 'minute');
    if (now.isAfter(before30Min) && now.isBefore(dueDate)) {
      const isAlreadyReminded = records.some(
        record => record.taskId === taskId && record.type === 'before'
      );
      
      if (!isAlreadyReminded) {
        reminders.push({
          taskId,
          taskTitle: task.title,
          type: 'before',
          message: `任务"${TaskUtils.truncateTitle(task.title, 20)}"将在30分钟后到期`,
          dueDate: task.dueDate
        });
      }
    }

    // 2. 截止时间提醒
    if (now.isAfter(dueDate.subtract(1, 'minute')) && now.isBefore(dueDate.add(1, 'minute'))) {
      const isAlreadyReminded = records.some(
        record => record.taskId === taskId && record.type === 'due'
      );
      
      if (!isAlreadyReminded) {
        reminders.push({
          taskId,
          taskTitle: task.title,
          type: 'due',
          message: `任务"${TaskUtils.truncateTitle(task.title, 20)}"已到期`,
          dueDate: task.dueDate
        });
      }
    }

    // 3. 逾期提醒（每24小时一次，最多3次）
    if (now.isAfter(dueDate)) {
      const overdueRecords = records.filter(
        record => record.taskId === taskId && record.type === 'overdue'
      );
      
      if (overdueRecords.length < 3) {
        const lastOverdueReminder = overdueRecords[overdueRecords.length - 1];
        const shouldRemind = !lastOverdueReminder || 
          now.isAfter(dayjs(lastOverdueReminder.timestamp).add(24, 'hour'));

        if (shouldRemind) {
          const daysOverdue = now.diff(dueDate, 'day');
          reminders.push({
            taskId,
            taskTitle: task.title,
            type: 'overdue',
            message: `任务"${TaskUtils.truncateTitle(task.title, 20)}"已逾期${daysOverdue}天`,
            dueDate: task.dueDate
          });
        }
      }
    }

    return reminders;
  }

  /**
   * 发送浏览器通知
   */
  private sendBrowserNotifications(reminders: IReminderEvent[]): void {
    if (!('Notification' in window)) {
      console.log('浏览器不支持通知功能');
      return;
    }

    if (Notification.permission === 'granted') {
      reminders.forEach(reminder => {
        const notification = new Notification('待办清单提醒', {
          body: reminder.message,
          icon: '/favicon.ico',
          tag: reminder.taskId, // 防止重复通知
          requireInteraction: true
        });

        // 点击通知时跳转到任务详情
        notification.onclick = () => {
          window.focus();
          notification.close();
          // 这里可以添加路由跳转逻辑
        };

        // 10秒后自动关闭
        setTimeout(() => {
          notification.close();
        }, 10000);
      });
    } else if (Notification.permission !== 'denied') {
      // 请求通知权限
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.sendBrowserNotifications(reminders);
        }
      });
    }
  }

  /**
   * 手动检查提醒
   */
  async checkNow(): Promise<void> {
    await this.checkReminders();
  }

  /**
   * 清除指定任务的提醒
   */
  clearTaskReminders(taskId: string): void {
    const keysToDelete: string[] = [];
    
    this.activeReminders.forEach((reminder, key) => {
      if (reminder.taskId === taskId) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.activeReminders.delete(key));
    
    // 更新提醒事件流
    const currentReminders = Array.from(this.activeReminders.values());
    this.reminderEvents$.next(currentReminders);
  }

  /**
   * 标记提醒为已处理
   */
  handleReminder(taskId: string, type: string): void {
    this.storageService.markReminderHandled(taskId, type);
    this.clearTaskReminders(taskId);
  }

  /**
   * 稍后提醒（延迟30分钟）
   */
  snoozeReminder(taskId: string): void {
    const reminder = Array.from(this.activeReminders.values())
      .find(r => r.taskId === taskId);
    
    if (reminder) {
      // 清除当前提醒
      this.clearTaskReminders(taskId);
      
      // 30分钟后重新检查
      setTimeout(() => {
        this.checkReminders();
      }, 30 * 60 * 1000);
    }
  }

  /**
   * 请求通知权限
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * 获取通知权限状态
   */
  getNotificationPermission(): 'default' | 'granted' | 'denied' {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * 获取当前活跃提醒数量
   */
  getActiveRemindersCount(): number {
    return this.activeReminders.size;
  }

  /**
   * 获取指定任务的活跃提醒
   */
  getTaskActiveReminders(taskId: string): IReminderEvent[] {
    return Array.from(this.activeReminders.values())
      .filter(reminder => reminder.taskId === taskId);
  }
}