/**
 * 设置组件
 * 负责应用的设置功能
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService, ISettings } from '../../services/storage.service';
import { ReminderService } from '../../services/reminder.service';
import { TaskService } from '../../services/task.service';

/**
 * 设置组件
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
  imports: [CommonModule]
})
export class SettingsComponent implements OnInit, OnDestroy {
  /** 组件销毁标识 */
  private destroy$ = new Subject<void>();
  
  /** 设置数据 */
  settings: ISettings = {
    enableReminders: true,
    theme: 'light'
  };
  
  /** 通知权限状态 */
  notificationPermission: 'default' | 'granted' | 'denied' = 'default';
  
  /** 存储信息 */
  storageInfo = {
    used: 0,
    available: 0,
    tasks: 0
  };

  constructor(
    private storageService: StorageService,
    private reminderService: ReminderService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadNotificationPermission();
    this.loadStorageInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 导航到列表页
   */
  navigateToList(): void {
    window.location.hash = '/';
  }

  /**
   * 加载设置
   */
  private loadSettings(): void {
    this.settings = this.storageService.getSettings();
  }

  /**
   * 加载通知权限状态
   */
  private loadNotificationPermission(): void {
    this.notificationPermission = this.reminderService.getNotificationPermission();
  }

  /**
   * 加载存储信息
   */
  private loadStorageInfo(): void {
    this.storageInfo = this.storageService.getStorageInfo();
  }

  /**
   * 切换提醒开关
   */
  toggleReminders(): void {
    this.settings.enableReminders = !this.settings.enableReminders;
    this.saveSettings();
  }

  /**
   * 切换主题
   */
  toggleTheme(): void {
    this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
    this.saveSettings();
    this.applyTheme();
  }

  /**
   * 保存设置
   */
  private saveSettings(): void {
    this.storageService.saveSettings(this.settings);
  }

  /**
   * 应用主题
   */
  private applyTheme(): void {
    // 这里可以实现主题切换逻辑
    document.body.classList.toggle('dark-theme', this.settings.theme === 'dark');
  }

  /**
   * 请求通知权限
   */
  async requestNotificationPermission(): Promise<void> {
    const granted = await this.reminderService.requestNotificationPermission();
    if (granted) {
      this.notificationPermission = 'granted';
      alert('通知权限已开启');
    } else {
      this.notificationPermission = 'denied';
      alert('通知权限被拒绝，您将无法收到任务提醒');
    }
  }

  /**
   * 清空所有任务
   */
  clearAllTasks(): void {
    const confirmMessage = '确定要清空所有任务吗？此操作不可恢复！';
    
    if (confirm(confirmMessage)) {
      const success = this.taskService.clearAllTasks();
      
      if (success) {
        alert('所有任务已清空');
        this.loadStorageInfo(); // 重新加载存储信息
      } else {
        alert('清空失败，请重试');
      }
    }
  }

  /**
   * 导出数据
   */
  exportData(): void {
    try {
      const data = this.taskService.exportTasks();
      
      if (!data) {
        alert('没有数据可导出');
        return;
      }

      // 创建下载链接
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('数据导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  }

  /**
   * 导入数据
   */
  importData(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (confirm('导入数据将覆盖现有任务，确定继续吗？')) {
          const success = this.taskService.importTasks(content);
          
          if (success) {
            alert('数据导入成功');
            this.loadStorageInfo(); // 重新加载存储信息
          } else {
            alert('数据格式错误，导入失败');
          }
        }
      } catch (error) {
        console.error('导入失败:', error);
        alert('文件读取失败，请重试');
      }
    };
    
    reader.onerror = () => {
      alert('文件读取失败，请重试');
    };
    
    reader.readAsText(file);
    
    // 清空文件输入
    fileInput.value = '';
  }

  /**
   * 获取存储使用率
   */
  get storageUsagePercentage(): number {
    const total = this.storageInfo.used + this.storageInfo.available;
    return total > 0 ? Math.round((this.storageInfo.used / total) * 100) : 0;
  }

  /**
   * 格式化存储大小
   */
  formatStorageSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  }

  /**
   * 获取通知权限状态文本
   */
  get notificationPermissionText(): string {
    const map = {
      'default': '未设置',
      'granted': '已开启',
      'denied': '已拒绝'
    };
    return map[this.notificationPermission] || '未知';
  }

  /**
   * 获取主题显示文本
   */
  get themeText(): string {
    return this.settings.theme === 'light' ? '浅色' : '深色';
  }

  /**
   * 返回首页
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}