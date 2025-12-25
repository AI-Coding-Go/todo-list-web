/**
 * 任务服务
 * 封装任务列表的获取、筛选、排序等状态管理
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import type { ITodoTaskResponse, EApiTaskStatus } from '../../shared/models/api.model';

/** 任务筛选类型 */
export type ETaskFilter = 'all' | 'pending' | 'completed';

/** 任务排序类型 */
export type ETaskSort = 'latest' | 'due' | 'priority';

/** 优先级权重 */
const PRIORITY_WEIGHT: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiService = inject(ApiService);

  /** 所有任务列表 */
  private tasks = signal<ITodoTaskResponse[]>([]);
  /** 加载状态 */
  loading = signal(false);
  /** 错误信息 */
  error = signal<string | null>(null);
  /** 当前筛选类型 */
  filter = signal<ETaskFilter>('all');
  /** 当前排序类型 */
  sort = signal<ETaskSort>('latest');

  /** 筛选后的任务列表 */
  filteredTasks = computed(() => {
    const currentFilter = this.filter();
    if (currentFilter === 'all') {
      return this.tasks();
    }
    const status: EApiTaskStatus = currentFilter === 'completed' ? 'COMPLETED' : 'PENDING';
    return this.tasks().filter(task => task.status === status);
  });

  /** 排序后的任务列表（最终输出） */
  sortedTasks = computed(() => {
    const result = [...this.filteredTasks()];
    const currentSort = this.sort();

    switch (currentSort) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'due':
        result.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        break;
      case 'priority':
        result.sort((a, b) => {
          const weightDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
          if (weightDiff !== 0) return weightDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }

    return result;
  });

  /** 获取任务列表 */
  fetchTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getTaskList().pipe(
      tap(data => {
        this.tasks.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set(err.message || '获取任务列表失败');
        this.loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  /** 标记任务完成/未完成 */
  toggleTaskStatus(id: number, completed: boolean): Observable<ITodoTaskResponse> {
    const request$ = completed
      ? this.apiService.markTaskComplete(id)
      : this.apiService.markTaskPending(id);

    return request$.pipe(
      tap(updatedTask => {
        this.tasks.update(currentTasks =>
          currentTasks.map(task => task.id === id ? updatedTask : task)
        );
      })
    );
  }

  /** 删除任务 */
  removeTask(id: number): Observable<unknown> {
    return this.apiService.deleteTask(id).pipe(
      tap(() => {
        this.tasks.update(currentTasks => currentTasks.filter(task => task.id !== id));
      })
    );
  }

  /** 添加新任务到列表 */
  addTask(task: ITodoTaskResponse): void {
    this.tasks.update(currentTasks => [task, ...currentTasks]);
  }

  /** 更新任务 */
  updateTask(id: number, updatedTask: ITodoTaskResponse): void {
    this.tasks.update(currentTasks =>
      currentTasks.map(task => task.id === id ? updatedTask : task)
    );
  }

  /** 获取单个任务 */
  getTaskById(id: number): Observable<ITodoTaskResponse> {
    return this.apiService.getTaskById(id);
  }

  /** 创建任务 */
  createTask(data: import('../../shared/models/api.model').ITodoTaskCreateRequest): Observable<ITodoTaskResponse> {
    return this.apiService.createTask(data);
  }

  /** 更新任务 */
  editTask(id: number, data: import('../../shared/models/api.model').ITodoTaskUpdateRequest): Observable<ITodoTaskResponse> {
    return this.apiService.updateTask(id, data);
  }
}
