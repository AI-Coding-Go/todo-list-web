/**
 * 提醒服务
 * 实现长轮询获取提醒、浏览器通知等功能
 */

import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Observable, interval, tap, catchError, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import type { ITodoTaskResponse } from '../../shared/models/api.model';

/** 提醒状态存储键 */
const REMINDER_ENABLED_KEY = 'h5_todo_reminder_enabled';
/** 已提醒任务存储键 */
const REMINDED_TASKS_KEY = 'h5_todo_remined_tasks';
/** 轮询间隔（毫秒） */
const POLLING_INTERVAL = 30000;

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiService = inject(ApiService);

  /** 当前提醒列表 */
  reminders = signal<ITodoTaskResponse[]>([]);
  /** 提醒开关是否开启 */
  private enabled = signal<boolean>(this.loadEnabledState());
  /** 轮询订阅 */
  private pollingSubscription: any = null;

  /** 当前提醒列表（只读） */
  currentReminders = computed(() => this.reminders());
  /** 提醒开关状态（只读） */
  isEnabled = computed(() => this.enabled());

  constructor() {
    // 初始化提醒功能
    effect((onCleanup) => {
      if (this.enabled()) {
        this.startPolling();
        // 请求通知权限
        this.requestNotificationPermission();

        onCleanup(() => {
          this.stopPolling();
        });
      } else {
        this.stopPolling();
        this.reminders.set([]);
      }
    });
  }

  /** 获取已提醒的任务 ID 集合 */
  private getRemindedTasks(): Set<number> {
    const stored = localStorage.getItem(REMINDED_TASKS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set<number>();
  }

  /** 保存已提醒的任务 ID */
  private saveRemindedTasks(taskIds: Set<number>): void {
    localStorage.setItem(REMINDED_TASKS_KEY, JSON.stringify([...taskIds]));
  }

  /** 加载提醒开关状态 */
  private loadEnabledState(): boolean {
    const stored = localStorage.getItem(REMINDER_ENABLED_KEY);
    return stored !== null ? stored === 'true' : true;
  }

  /** 请求浏览器通知权限 */
  private requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  /** 开始轮询 */
  private startPolling(): void {
    // 立即执行一次
    this.fetchReminders();

    // 设置定时轮询
    this.pollingSubscription = interval(POLLING_INTERVAL).subscribe(() => {
      this.fetchReminders();
    });
  }

  /** 停止轮询 */
  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  /** 获取提醒列表 */
  private fetchReminders(): void {
    this.apiService.getReminders().pipe(
      tap(data => {
        const remindedTasks = this.getRemindedTasks();
        // 过滤掉已提醒的任务
        const newReminders = data.filter(task => !remindedTasks.has(task.id));

        if (newReminders.length > 0) {
          this.reminders.set(newReminders);
          // 显示浏览器通知（仅第一条）
          this.showBrowserNotification(newReminders[0]);
        }
      }),
      catchError(err => {
        console.error('获取提醒失败:', err);
        return of([]);
      })
    ).subscribe();
  }

  /** 显示浏览器通知 */
  private showBrowserNotification(task: ITodoTaskResponse): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('待办任务提醒', {
        body: `${task.title}${task.deadlineFormatted ? ` - 截止：${task.deadlineFormatted}` : ''}`,
        icon: '/vite.svg',
        tag: `task-${task.id}`
      });
    }
  }

  /** 设置提醒开关 */
  setEnabled(value: boolean): void {
    this.enabled.set(value);
    localStorage.setItem(REMINDER_ENABLED_KEY, String(value));
  }

  /** 标记任务已提醒 */
  markAsReminded(taskId: number): void {
    const remindedTasks = this.getRemindedTasks();
    remindedTasks.add(taskId);
    this.saveRemindedTasks(remindedTasks);
    this.reminders.update(current => current.filter(task => task.id !== taskId));
  }

  /** 清除所有提醒 */
  clearReminders(): void {
    this.reminders.set([]);
  }

  /** 移除单个提醒 */
  removeReminder(taskId: string): void {
    this.reminders.update(current => current.filter(task => String(task.id) !== taskId));
  }

  /** 获取通知权限状态 */
  getNotificationPermission(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  /** 请求通知权限 */
  requestPermission(): Observable<NotificationPermission> {
    if ('Notification' in window) {
      const promise = Notification.requestPermission();
      return new Observable(observer => {
        promise.then(permission => {
          observer.next(permission);
          observer.complete();
        });
      });
    }
    return of('denied');
  }
}
