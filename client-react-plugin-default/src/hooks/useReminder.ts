/**
 * 提醒功能自定义Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ITask, IReminderEvent, IReminderSettings } from '../types';
import { storageService } from '../services/storage';
import { REMINDER_TIMES } from '../constants';
import { isOverdue, formatDateTime } from '../utils';

/**
 * 提醒功能Hook
 */
export const useReminder = (tasks: ITask[]) => {
  const [reminderEvents, setReminderEvents] = useState<IReminderEvent[]>([]);
  const [settings, setSettings] = useState<IReminderSettings>({
    enabled: true,
    lastCheckTime: new Date().toISOString(),
  });
  const [activeReminder, setActiveReminder] = useState<IReminderEvent | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 加载设置和提醒事件
  const loadSettings = useCallback(() => {
    try {
      const appSettings = storageService.getSettings();
      setSettings(appSettings.reminderSettings);
      const events = storageService.getReminderEvents();
      setReminderEvents(events);
    } catch (error) {
      console.error('加载提醒设置失败:', error);
    }
  }, []);

  // 保存设置
  const saveSettings = useCallback((newSettings: IReminderSettings) => {
    try {
      const appSettings = storageService.getSettings();
      appSettings.reminderSettings = newSettings;
      storageService.saveSettings(appSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('保存提醒设置失败:', error);
    }
  }, []);

  // 检查是否需要提醒
  const checkReminders = useCallback(() => {
    if (!settings.enabled) return;

    const now = new Date();
    
    // 获取需要提醒的任务
    const tasksToRemind = tasks.filter(task => {
      if (task.status === 'completed' || !task.deadline) return false;
      
      const deadline = new Date(task.deadline);
      const timeDiff = deadline.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      
      // 检查是否在提醒时间范围内
      const shouldRemind = 
        minutesDiff <= REMINDER_TIMES.UPCOMING && minutesDiff > 0 || // 截止前30分钟内
        minutesDiff <= 0 && minutesDiff >= -60; // 截止时间或逾期1小时内
      
      return shouldRemind;
    });

    // 生成提醒事件
    const newEvents: IReminderEvent[] = tasksToRemind.map(task => {
      const deadline = new Date(task.deadline!);
      const now = new Date();
      const timeDiff = deadline.getTime() - now.getTime();
      
      let type: 'upcoming' | 'due' | 'overdue';
      if (timeDiff > 0 && timeDiff <= REMINDER_TIMES.UPCOMING * 60 * 1000) {
        type = 'upcoming';
      } else if (timeDiff <= 0 && timeDiff >= -60 * 60 * 1000) {
        type = 'due';
      } else {
        type = 'overdue';
      }

      return {
        taskId: task.id,
        taskTitle: task.title,
        deadline: task.deadline!,
        type,
      };
    });

    // 使用当前状态过滤掉已经提醒过的事件
    setReminderEvents(currentEvents => {
      // 过滤掉已经提醒过的事件
      const uniqueEvents = newEvents.filter(newEvent => {
        return !currentEvents.some(existingEvent => 
          existingEvent.taskId === newEvent.taskId && 
          existingEvent.type === newEvent.type
        );
      });

      if (uniqueEvents.length > 0) {
        // 保存新的提醒事件
        const allEvents = [...currentEvents, ...uniqueEvents];
        storageService.saveReminderEvents(allEvents);
        
        // 显示第一个提醒
        setActiveReminder(uniqueEvents[0]);
        
        return allEvents;
      }
      
      return currentEvents;
    });

    // 更新最后检查时间
    setSettings(currentSettings => ({
      ...currentSettings,
      lastCheckTime: now.toISOString(),
    }));
  }, [tasks, settings.enabled]);

  // 清除提醒
  const clearReminder = useCallback(() => {
    setActiveReminder(null);
  }, []);

  // 稍后提醒
  const snoozeReminder = useCallback(() => {
    if (activeReminder) {
      clearReminder();
      // 5分钟后再次检查
      setTimeout(() => {
        checkReminders();
      }, 5 * 60 * 1000);
    }
  }, [activeReminder, clearReminder, checkReminders]);

  // 查看任务
  const viewTask = useCallback((taskId: string) => {
    clearReminder();
    // 导航到任务详情页的逻辑将在组件中处理
    window.location.hash = `/task/${taskId}`;
  }, [clearReminder]);

  // 请求浏览器通知权限
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return 'Notification' in window && Notification.permission === 'granted';
  }, []);

  // 显示浏览器通知
  const showBrowserNotification = useCallback((event: IReminderEvent) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('待办任务提醒', {
        body: `${event.taskTitle} - ${formatDateTime(event.deadline, 'MM月DD日 HH:mm')}`,
        icon: '/favicon.ico',
        tag: event.taskId,
      });

      notification.onclick = () => {
        window.focus();
        viewTask(event.taskId);
        notification.close();
      };

      // 5秒后自动关闭
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }, [viewTask]);

  // 初始化
  useEffect(() => {
    loadSettings();
    requestNotificationPermission();
  }, [loadSettings, requestNotificationPermission]);

  // 设置定时检查
  useEffect(() => {
    if (settings.enabled) {
      // 立即检查一次
      checkReminders();
      
      // 设置定时器，每分钟检查一次
      intervalRef.current = setInterval(() => {
        checkReminders();
      }, 60 * 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [settings.enabled, checkReminders]);

  // 当有新提醒时，显示浏览器通知
  useEffect(() => {
    if (activeReminder) {
      showBrowserNotification(activeReminder);
    }
  }, [activeReminder, showBrowserNotification]);

  return {
    settings,
    activeReminder,
    reminderEvents,
    updateSettings: saveSettings,
    clearReminder,
    snoozeReminder,
    viewTask,
    requestNotificationPermission,
  };
};