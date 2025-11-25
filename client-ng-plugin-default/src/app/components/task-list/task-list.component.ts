/**
 * 任务列表组件
 * 负责显示任务列表和相关操作
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { ReminderService, IReminderEvent } from '../../services/reminder.service';
import { ITask, TaskFilter, TaskSort, TaskUtils, Priority } from '../../models/task.model';

/**
 * 任务列表组件
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.less'],
  imports: [CommonModule]
})
export class TaskListComponent implements OnInit, OnDestroy {
  /** 组件销毁标识 */
  private destroy$ = new Subject<void>();
  
  /** 任务列表 */
  tasks: ITask[] = [];
  
  /** 当前筛选条件 */
  currentFilter: TaskFilter = 'all';
  
  /** 当前排序条件 */
  currentSort: TaskSort = 'newest';
  
  /** 活跃提醒 */
  activeReminders: IReminderEvent[] = [];
  
  /** 显示排序选项 */
  showSortOptions = false;
  
  /** 选中的任务ID（用于显示操作按钮） */
  selectedTaskId: string | null = null;

  constructor(
    private taskService: TaskService,
    private reminderService: ReminderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initSubscriptions();
    this.taskService.refreshTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 初始化订阅
   */
  private initSubscriptions(): void {
    // 订阅任务列表
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateTasksList();
      });

    // 订阅提醒事件
    this.reminderService.getReminderEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reminders => {
        this.activeReminders = reminders;
      });
  }

  /**
   * 更新任务列表
   */
  private updateTasksList(): void {
    this.tasks = this.taskService.getFilteredAndSortedTasks();
    this.currentFilter = this.taskService.getCurrentFilter();
    this.currentSort = this.taskService.getCurrentSort();
  }

  /**
   * 切换任务完成状态
   */
  toggleTaskStatus(taskId: string, event: Event): void {
    event.stopPropagation();
    this.taskService.toggleTaskStatus(taskId);
  }

  /**
   * 选择任务
   */
  selectTask(taskId: string): void {
    this.selectedTaskId = this.selectedTaskId === taskId ? null : taskId;
  }

  /**
   * 编辑任务
   */
  editTask(taskId: string, event: Event): void {
    event.stopPropagation();
    // 跳转到编辑页面
    this.navigateToEdit(taskId);
  }

  /**
   * 删除任务
   */
  deleteTask(taskId: string, event: Event): void {
    event.stopPropagation();
    
    if (confirm('确定删除该任务？删除后不可恢复')) {
      this.taskService.deleteTask(taskId);
      this.reminderService.clearTaskReminders(taskId);
    }
  }

  /**
   * 查看任务详情
   */
  viewTaskDetail(taskId: string): void {
    // 跳转到任务详情页面
    this.navigateToDetail(taskId);
  }

  /**
   * 设置筛选条件
   */
  setFilter(filter: TaskFilter): void {
    this.taskService.setFilter(filter);
  }

  /**
   * 切换排序选项显示
   */
  toggleSortOptions(): void {
    this.showSortOptions = !this.showSortOptions;
  }

  /**
   * 设置排序条件
   */
  setSort(sort: TaskSort): void {
    this.taskService.setSort(sort);
    this.showSortOptions = false;
  }

  /**
   * 新增任务
   */
  addTask(): void {
    // 跳转到新增任务页面
    this.navigateToAdd();
  }

  /**
   * 处理提醒
   */
  handleReminder(reminder: IReminderEvent): void {
    this.reminderService.handleReminder(reminder.taskId, reminder.type);
    this.navigateToDetail(reminder.taskId);
  }

  /**
   * 稍后提醒
   */
  snoozeReminder(reminder: IReminderEvent): void {
    this.reminderService.snoozeReminder(reminder.taskId);
  }

  /**
   * 关闭提醒
   */
  closeReminder(reminder: IReminderEvent): void {
    this.reminderService.handleReminder(reminder.taskId, reminder.type);
  }

  /**
   * 获取优先级颜色类
   */
  getPriorityClass(priority: Priority): string {
    return `priority-${priority}`;
  }

  /**
   * 获取优先级文本
   */
  getPriorityText(priority: Priority): string {
    return TaskUtils.getPriorityText(priority);
  }

  /**
   * 格式化截止时间
   */
  formatDueDate(dueDate?: string): string {
    return TaskUtils.formatDueDate(dueDate);
  }

  /**
   * 检查任务是否逾期
   */
  isOverdue(task: ITask): boolean {
    return TaskUtils.isOverdue(task);
  }

  /**
   * 截断任务标题
   */
  truncateTitle(title: string): string {
    return TaskUtils.truncateTitle(title);
  }

  /**
   * 获取排序显示文本
   */
  getSortText(sort: TaskSort): string {
    const sortMap = {
      newest: '最新添加',
      dueDate: '即将截止',
      priority: '优先级'
    };
    return sortMap[sort] || '最新添加';
  }

  /**
   * 获取筛选显示文本
   */
  getFilterText(filter: TaskFilter): string {
    const filterMap = {
      all: '全部',
      pending: '未完成',
      completed: '已完成'
    };
    return filterMap[filter] || '全部';
  }

  /**
   * 检查列表是否为空
   */
  get isEmpty(): boolean {
    return this.tasks.length === 0;
  }

  /**
   * 获取空状态提示文本
   */
  get emptyText(): string {
    switch (this.currentFilter) {
      case 'pending':
        return '暂无未完成的任务';
      case 'completed':
        return '暂无已完成的任务';
      default:
        return '暂无任务，点击右下角 + 按钮添加第一个任务';
    }
  }

  /**
   * trackBy函数用于优化ngFor性能
   */
  trackByTaskId(index: number, task: ITask): string {
    return task.id;
  }

  /**
   * trackBy函数用于优化提醒列表性能
   */
  trackByReminderId(index: number, reminder: IReminderEvent): string {
    return `${reminder.taskId}_${reminder.type}`;
  }

  /**
   * 导航方法
   */
  private navigateToAdd(): void {
    this.router.navigate(['/tasks/new']);
  }

  private navigateToEdit(taskId: string): void {
    this.router.navigate([`/tasks/${taskId}/edit`]);
  }

  private navigateToDetail(taskId: string): void {
    this.router.navigate([`/tasks/${taskId}`]);
  }
}