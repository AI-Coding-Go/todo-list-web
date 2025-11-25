/**
 * 任务详情组件
 * 负责显示任务的详细信息
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { ReminderService } from '../../services/reminder.service';
import { ITask, TaskUtils, Priority } from '../../models/task.model';

/**
 * 任务详情组件
 */
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.less'],
  imports: [CommonModule]
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  /** 组件销毁标识 */
  private destroy$ = new Subject<void>();
  
  /** 任务ID */
  taskId: string | null = null;
  
  /** 任务详情 */
  task: ITask | null = null;
  
  /** 加载状态 */
  isLoading = true;
  
  /** 显示操作菜单 */
  showActionMenu = false;

  constructor(
    private taskService: TaskService,
    private reminderService: ReminderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initRouteParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 初始化路由参数
   */
  private initRouteParams(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.taskId = params['id'];
        if (this.taskId) {
          this.loadTaskDetail();
        } else {
          this.navigateToList();
        }
      });
  }

  /**
   * 加载任务详情
   */
  private loadTaskDetail(): void {
    if (!this.taskId) return;
    
    this.isLoading = true;
    const task = this.taskService.getTaskById(this.taskId);
    
    if (task) {
      this.task = task;
      this.isLoading = false;
    } else {
      // 任务不存在，返回列表页
      this.navigateToList();
    }
  }

  /**
   * 切换任务完成状态
   */
  toggleTaskStatus(): void {
    if (!this.task) return;
    
    this.taskService.toggleTaskStatus(this.task.id);
    this.loadTaskDetail(); // 重新加载任务数据
  }

  /**
   * 编辑任务
   */
  editTask(): void {
    if (!this.task) return;
    
    this.router.navigate([`/tasks/${this.task.id}/edit`]);
  }

  /**
   * 删除任务
   */
  deleteTask(): void {
    if (!this.task) return;
    
    if (confirm('确定删除该任务？删除后不可恢复')) {
      const success = this.taskService.deleteTask(this.task.id);
      if (success) {
        this.reminderService.clearTaskReminders(this.task.id);
        this.navigateToList();
      } else {
        alert('删除失败，请重试');
      }
    }
  }

  /**
   * 复制任务
   */
  duplicateTask(): void {
    if (!this.task) return;
    
    const success = this.taskService.duplicateTask(this.task.id);
    if (success) {
      alert('任务复制成功');
      this.navigateToList();
    } else {
      alert('复制失败，请重试');
    }
  }

  /**
   * 设置提醒
   */
  setReminder(): void {
    if (!this.task) return;
    
    // 这里可以集成原生提醒功能或使用浏览器通知
    const message = `任务"${this.task.title}"提醒已设置`;
    alert(message);
  }

  /**
   * 切换操作菜单显示
   */
  toggleActionMenu(): void {
    this.showActionMenu = !this.showActionMenu;
  }

  /**
   * 关闭操作菜单
   */
  closeActionMenu(): void {
    this.showActionMenu = false;
  }

  /**
   * 返回列表
   */
  goBack(): void {
    this.navigateToList();
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
    if (!dueDate) return '未设置';
    return TaskUtils.formatDueDate(dueDate);
  }

  /**
   * 格式化创建时间
   */
  formatCreatedAt(createdAt: string): string {
    return TaskUtils.formatCreatedAt(createdAt);
  }

  /**
   * 格式化完成时间
   */
  formatCompletedAt(completedAt?: string): string {
    if (!completedAt) return '未完成';
    return TaskUtils.formatCreatedAt(completedAt);
  }

  /**
   * 检查任务是否逾期
   */
  isOverdue(): boolean {
    if (!this.task) return false;
    return TaskUtils.isOverdue(this.task);
  }

  /**
   * 获取状态文本
   */
  getStatusText(): string {
    if (!this.task) return '';
    return TaskUtils.getStatusText(this.task.status);
  }

  /**
   * 获取状态样式类
   */
  getStatusClass(): string {
    if (!this.task) return '';
    return `status-${this.task.status}`;
  }

  /**
   * 导航方法
   */
  private navigateToList(): void {
    this.router.navigate(['/']);
  }
}