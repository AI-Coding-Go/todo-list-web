/**
 * 底部导航组件
 * 负责应用的主要导航功能
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReminderService } from '../../services/reminder.service';

/**
 * 导航项接口
 */
interface INavItem {
  /** 路由路径 */
  path: string;
  /** 图标类名 */
  icon: string;
  /** 显示文本 */
  text: string;
  /** 是否激活 */
  active: boolean;
}

/**
 * 底部导航组件
 */
@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.less'],
  imports: [CommonModule]
})
export class BottomNavComponent implements OnInit, OnDestroy {
  /** 组件销毁标识 */
  private destroy$ = new Subject<void>();
  
  /** 导航项列表 */
  navItems: INavItem[] = [
    {
      path: '/',
      icon: 'fa-list',
      text: '待办',
      active: true
    },
    {
      path: '/statistics',
      icon: 'fa-bar-chart',
      text: '统计',
      active: false
    },
    {
      path: '/settings',
      icon: 'fa-cog',
      text: '设置',
      active: false
    }
  ];
  
  /** 活跃提醒数量 */
  activeRemindersCount = 0;

  constructor(
    private router: Router,
    private reminderService: ReminderService
  ) {}

  ngOnInit(): void {
    this.initRouterEvents();
    this.initReminderSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 初始化路由事件监听
   */
  private initRouterEvents(): void {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateActiveState();
      });
    
    // 初始化时更新一次状态
    this.updateActiveState();
  }

  /**
   * 初始化提醒订阅
   */
  private initReminderSubscription(): void {
    this.reminderService.getReminderEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.activeRemindersCount = this.reminderService.getActiveRemindersCount();
      });
  }

  /**
   * 更新导航项激活状态
   */
  private updateActiveState(): void {
    const currentUrl = this.router.url;
    
    this.navItems.forEach(item => {
      item.active = currentUrl === item.path;
    });
  }

  /**
   * 导航到指定路径
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  /**
   * 获取导航项样式类
   */
  getNavItemClass(item: INavItem): string {
    return item.active ? 'active' : '';
  }

  /**
   * 检查是否显示提醒徽章
   */
  shouldShowReminderBadge(): boolean {
    return this.activeRemindersCount > 0;
  }

  /**
   * trackBy函数用于优化ngFor性能
   */
  trackByPath(index: number, item: INavItem): string {
    return item.path;
  }

  /**
   * 获取提醒徽章文本
   */
  getReminderBadgeText(): string {
    return this.activeRemindersCount > 9 ? '9+' : this.activeRemindersCount.toString();
  }
}