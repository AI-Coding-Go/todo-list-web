/**
 * 任务详情页组件
 * 展示任务的完整信息，支持编辑、删除、标记状态等操作
 */

import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TaskService } from '../../core/services/task.service';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import type { ITodoTaskResponse, EApiTaskPriority } from '../../shared/models/api.model';

/** 优先级配置 */
const PRIORITY_CONFIG: Record<EApiTaskPriority, { bg: string; text: string; label: string }> = {
  HIGH: { bg: 'bg-red-100', text: 'text-red-600', label: '高' },
  MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-600', label: '中' },
  LOW: { bg: 'bg-green-100', text: 'text-green-600', label: '低' }
};

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, TopBarComponent, ConfirmDialogComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  /** 任务数据 */
  task: ITodoTaskResponse | null = null;
  /** 加载状态 */
  loading = true;
  /** 操作加载状态 */
  actionLoading = false;
  /** 显示删除确认弹窗 */
  showDeleteConfirm = false;

  /** 是否逾期 */
  isOverdue = computed(() => {
    return this.task?.overdue && this.task?.status !== 'COMPLETED';
  });

  /** 优先级配置 */
  priorityConfig = computed(() => {
    return this.task ? PRIORITY_CONFIG[this.task.priority] : null;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.taskService.getTaskById(Number(id));
        }
        return [];
      })
    ).subscribe({
      next: (task: ITodoTaskResponse) => {
        this.task = task;
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('加载任务失败:', err);
        this.router.navigate(['']);
      }
    });
  }

  /** 处理返回 */
  onBack(): void {
    this.router.navigate(['']);
  }

  /** 处理编辑 */
  onEdit(): void {
    if (this.task) {
      this.router.navigate(['/task/edit', this.task.id]);
    }
  }

  /** 处理删除 */
  onDelete(): void {
    this.showDeleteConfirm = true;
  }

  /** 确认删除 */
  onConfirmDelete(): void {
    if (this.task) {
      this.actionLoading = true;
      this.taskService.removeTask(this.task.id).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err: unknown) => {
          console.error('删除失败:', err);
          alert('删除失败，请重试');
          this.actionLoading = false;
        }
      });
    }
  }

  /** 取消删除 */
  onCancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  /** 处理标记状态切换 */
  onToggleStatus(): void {
    if (!this.task) return;

    this.actionLoading = true;
    const request$ = this.task.status === 'COMPLETED'
      ? this.taskService.toggleTaskStatus(this.task.id, false)
      : this.taskService.toggleTaskStatus(this.task.id, true);

    request$.subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        this.actionLoading = false;
      },
      error: (err: unknown) => {
        console.error('更新状态失败:', err);
        alert('更新状态失败，请重试');
        this.actionLoading = false;
      }
    });
  }

  /** 格式化日期时间 */
  formatFullDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  /** 获取状态文本 */
  getStatusText(): string {
    return this.task?.status === 'COMPLETED' ? '已完成' : '未完成';
  }

  /** 获取状态样式类 */
  getStatusClass(): string {
    return this.task?.status === 'COMPLETED'
      ? 'bg-green-100 text-green-600'
      : 'bg-blue-100 text-blue-600';
  }

  /** 获取按钮文本 */
  getToggleButtonText(): string {
    return this.task?.status === 'COMPLETED' ? '标记为未完成' : '标记为已完成';
  }
}
