/**
 * 设置页组件
 * 包含提醒开关等应用设置
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ReminderService } from '../../core/services/reminder.service';

/** 提醒开关存储键 */
const REMINDER_ENABLED_KEY = 'h5_todo_reminder_enabled';

/** 应用版本 */
const APP_VERSION = '1.0.0';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TopBarComponent, BottomNavComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private reminderService = inject(ReminderService);

  /** 提醒开关状态 */
  reminderEnabled = this.reminderService.isEnabled;
  /** 通知权限状态 */
  notificationPermission = this.reminderService.getNotificationPermission();

  /** 检查浏览器是否支持通知 */
  readonly hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;

  /** 处理提醒开关切换 */
  async onToggleReminder(): Promise<void> {
    const newValue = !this.reminderService.isEnabled();

    if (newValue && this.notificationPermission === 'default') {
      // 用户开启提醒时请求通知权限
      const permission = await this.requestNotificationPermission();
      if (permission === 'granted' || permission === 'denied') {
        this.reminderService.setEnabled(true);
      }
    } else {
      this.reminderService.setEnabled(newValue);
    }
  }

  /** 请求通知权限 */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (this.hasNotificationSupport) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  /** 获取通知权限状态文本 */
  getPermissionText(): string {
    if (!this.hasNotificationSupport) {
      return '当前浏览器不支持通知';
    }
    switch (this.notificationPermission) {
      case 'granted':
        return '已授权';
      case 'denied':
        return '已拒绝';
      case 'default':
        return '未设置';
      default:
        return '未知';
    }
  }

  /** 获取通知权限状态颜色类 */
  getPermissionColorClass(): string {
    switch (this.notificationPermission) {
      case 'granted':
        return 'text-green-500';
      case 'denied':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  }

  /** 处理通知权限设置 */
  onRequestPermission(): void {
    this.requestNotificationPermission().then(permission => {
      this.notificationPermission = permission;
    });
  }

  /** 获取应用版本 */
  getAppVersion(): string {
    return `v${APP_VERSION}`;
  }
}
