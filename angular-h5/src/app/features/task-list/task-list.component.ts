/**
 * 任务列表页组件
 * 展示任务列表，支持筛选、排序、操作等功能
 */

import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService, ETaskFilter, ETaskSort } from '../../core/services/task.service';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import type { ITodoTaskResponse, EApiTaskPriority } from '../../shared/models/api.model';

/** 筛选选项 */
const FILTER_OPTIONS = [
  { value: 'all' as const, label: '全部' },
  { value: 'pending' as const, label: '未完成' },
  { value: 'completed' as const, label: '已完成' }
];

/** 排序选项 */
const SORT_OPTIONS = [
  { value: 'latest' as const, label: '最新添加' },
  { value: 'due' as const, label: '即将截止' },
  { value: 'priority' as const, label: '优先级' }
];

/** 优先级颜色映射 */
const PRIORITY_COLORS: Record<EApiTaskPriority, string> = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW: 'bg-green-500'
};

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TopBarComponent,
    BottomNavComponent,
    FabButtonComponent,
    ConfirmDialogComponent,
    EmptyStateComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private router = inject(Router);
  private taskService = inject(TaskService);

  /** 任务列表 */
  tasks = computed(() => this.taskService.sortedTasks());
  /** 加载状态 */
  loading = computed(() => this.taskService.loading());
  /** 当前筛选 */
  filter = computed(() => this.taskService.filter());
  /** 当前排序 */
  sort = computed(() => this.taskService.sort());

  /** 显示排序菜单 */
  showSortMenu = false;
  /** 筛选选项 */
  filterOptions = FILTER_OPTIONS;
  /** 排序选项 */
  sortOptions = SORT_OPTIONS;

  /** 确认弹窗状态 */
  confirmOpen = false;
  confirmTitle = '';
  pendingDeleteId: number | null = null;

  constructor() {
    // 初始化加载任务列表
    this.taskService.fetchTasks();
  }

  /** 设置筛选 */
  onSetFilter(value: ETaskFilter): void {
    this.taskService.filter.set(value);
  }

  /** 设置排序 */
  onSetSort(value: ETaskSort): void {
    this.taskService.sort.set(value);
    this.showSortMenu = false;
  }

  /** 切换排序菜单 */
  onToggleSortMenu(): void {
    this.showSortMenu = !this.showSortMenu;
  }

  /** 处理删除任务 */
  onHandleDelete(id: number): void {
    this.pendingDeleteId = id;
    this.confirmTitle = '确定删除该任务？删除后不可恢复';
    this.confirmOpen = true;
  }

  /** 确认删除 */
  onConfirmDelete(): void {
    if (this.pendingDeleteId !== null) {
      this.taskService.removeTask(this.pendingDeleteId).subscribe({
        error: (err) => console.error('删除失败:', err)
      });
    }
    this.confirmOpen = false;
    this.pendingDeleteId = null;
  }

  /** 取消删除 */
  onCancelDelete(): void {
    this.confirmOpen = false;
    this.pendingDeleteId = null;
  }

  /** 处理复选框点击 */
  onHandleCheckboxChange(task: ITodoTaskResponse): void {
    this.taskService.toggleTaskStatus(task.id, task.status !== 'COMPLETED').subscribe({
      error: (err) => console.error('更新状态失败:', err)
    });
  }

  /** 导航到新增页 */
  onNavigateToNew(): void {
    this.router.navigate(['/task/new']);
  }

  /** 导航到详情页 */
  onNavigateToDetail(id: number): void {
    this.router.navigate(['/task', id]);
  }

  /** 获取优先级颜色 */
  getPriorityColor(priority: EApiTaskPriority): string {
    return PRIORITY_COLORS[priority];
  }

  /** 获取任务项样式类 */
  getTaskItemClass(task: ITodoTaskResponse): string {
    const baseClass = 'task-item bg-white rounded-lg p-4 mb-3 shadow-sm';
    const completedClass = task.status === 'COMPLETED' ? 'opacity-60' : '';
    return `${baseClass} ${completedClass}`;
  }

  /** 格式化截止时间显示 */
  formatDeadline(task: ITodoTaskResponse): { text: string; class: string } | null {
    if (!task.deadlineFormatted) {
      return null;
    }
    const isOverdue = task.overdue && task.status !== 'COMPLETED';
    return {
      text: `${isOverdue ? '逾期 ' : ''}${task.deadlineFormatted}`,
      class: isOverdue ? 'text-red-500' : 'text-gray-400'
    };
  }

  /** 获取当前排序标签 */
  getCurrentSortLabel(): string {
    return this.sortOptions.find(s => s.value === this.sort())?.label || '最新添加';
  }
}
