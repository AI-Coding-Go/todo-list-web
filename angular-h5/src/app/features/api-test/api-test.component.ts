/**
 * API 测试页面组件
 * 用于测试所有后端接口功能
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { formatDateTime } from '../../utils/date.util';
import type { ITodoTaskResponse } from '../../shared/models/api.model';

/** API 测试项接口 */
interface IApiTestItem {
  /** 显示名称 */
  label: string;
  /** HTTP 方法 */
  method: string;
  /** 接口路径 */
  path: string;
  /** 测试函数 */
  action: () => void;
}

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-test.component.html',
})
export class ApiTestComponent {
  /** API 服务 */
  private readonly apiService = inject(ApiService);

  /** 测试任务 ID */
  testTaskId = signal(1);

  /** 测试项列表 */
  readonly testItems: IApiTestItem[] = [
    {
      label: '获取任务列表',
      method: 'GET',
      path: '/api/tasks',
      action: () => this.testGetTaskList(),
    },
    {
      label: '获取单个任务',
      method: 'GET',
      path: '/api/tasks/1',
      action: () => this.testGetTaskById(),
    },
    {
      label: '创建新任务',
      method: 'POST',
      path: '/api/tasks',
      action: () => this.testCreateTask(),
    },
    {
      label: '更新任务',
      method: 'PUT',
      path: '/api/tasks/1',
      action: () => this.testUpdateTask(),
    },
    {
      label: '删除任务',
      method: 'DELETE',
      path: '/api/tasks/1',
      action: () => this.testDeleteTask(),
    },
    {
      label: '标记任务完成',
      method: 'PATCH',
      path: '/api/tasks/1/complete',
      action: () => this.testMarkComplete(),
    },
    {
      label: '标记任务未完成',
      method: 'PATCH',
      path: '/api/tasks/1/pending',
      action: () => this.testMarkPending(),
    },
    {
      label: '获取当前提醒',
      method: 'GET',
      path: '/api/reminders',
      action: () => this.testGetReminders(),
    },
  ];

  /** 用于触发变更检测的信号 */
  readonly triggerUpdate = signal(0);

  /** 当前加载状态的按钮索引 */
  loadingIndex = signal<number | null>(null);

  /** 各测试项的状态 */
  itemStates = signal<Record<number, 'success' | 'error' | null>>({});

  /**
   * 测试获取任务列表
   */
  testGetTaskList(): void {
    this.setLoading(0);
    console.group('📡 API 调用 - 获取任务列表');
    console.log('🔗 请求:', 'GET /api/tasks');

    this.apiService.getTaskList().subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        this.setItemState(0, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(0, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 测试获取单个任务
   */
  testGetTaskById(): void {
    this.setLoading(1);
    const id = this.testTaskId();
    console.group('📡 API 调用 - 获取单个任务');
    console.log('🔗 请求:', `GET /api/tasks/${id}`);

    this.apiService.getTaskById(id).subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        this.setItemState(1, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(1, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 测试创建新任务
   */
  testCreateTask(): void {
    this.setLoading(2);

    const newTask = {
      title: '测试任务 ' + Date.now(),
      description: '这是一个测试任务描述',
      priority: 'HIGH' as const,
      deadline: formatDateTime(Date.now() + 86400000, 'YYYY-MM-DDTHH:mm:ss'),
    };

    console.group('📡 API 调用 - 创建新任务');
    console.log('🔗 请求:', 'POST /api/tasks');
    console.log('📤 请求体:', newTask);

    this.apiService.createTask(newTask).subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        // 更新测试任务 ID 为新创建的任务 ID
        this.testTaskId.set(response.id);
        this.setItemState(2, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(2, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 测试更新任务
   */
  testUpdateTask(): void {
    this.setLoading(3);
    const id = this.testTaskId();
    const updateData = {
      title: '更新后的任务标题 ' + Date.now(),
      description: '更新后的任务描述',
    };

    console.group('📡 API 调用 - 更新任务');
    console.log('🔗 请求:', `PUT /api/tasks/${id}`);
    console.log('📤 请求体:', updateData);

    this.apiService.updateTask(id, updateData).subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        this.setItemState(3, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(3, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 测试删除任务
   */
  testDeleteTask(): void {
    this.setLoading(4);
    const id = this.testTaskId();
    console.group('📡 API 调用 - 删除任务');
    console.log('🔗 请求:', `DELETE /api/tasks/${id}`);

    this.apiService.deleteTask(id).subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        this.setItemState(4, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(4, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 测试标记任务完成
   */
  testMarkComplete(): void {
    this.setLoading(5);
    const id = this.testTaskId();
    console.group('📡 API 调用 - 标记任务完成');
    console.log('🔗 请求:', `PATCH /api/tasks/${id}/complete`);

    this.apiService.markTaskComplete(id).subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        this.setItemState(5, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(5, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 测试标记任务未完成
   */
  testMarkPending(): void {
    this.setLoading(6);
    const id = this.testTaskId();
    console.group('📡 API 调用 - 标记任务未完成');
    console.log('🔗 请求:', `PATCH /api/tasks/${id}/pending`);

    this.apiService.markTaskPending(id).subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        this.setItemState(6, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(6, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 测试获取当前提醒
   */
  testGetReminders(): void {
    this.setLoading(7);
    console.group('📡 API 调用 - 获取当前提醒');
    console.log('🔗 请求:', 'GET /api/reminders');

    this.apiService.getReminders().subscribe({
      next: (response) => {
        console.log('✅ 成功:', response);
        this.setItemState(7, 'success');
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ 失败:', error);
        this.setItemState(7, 'error');
        console.groupEnd();
      },
    });
  }

  /**
   * 设置加载状态
   */
  private setLoading(index: number): void {
    this.loadingIndex.set(index);
    this.itemStates.update((states) => ({ ...states, [index]: null }));
  }

  /**
   * 设置项目状态
   */
  private setItemState(index: number, state: 'success' | 'error'): void {
    this.loadingIndex.set(null);
    this.itemStates.update((states) => ({ ...states, [index]: state }));
    this.triggerUpdate.update((v) => v + 1);
  }

  /**
   * 获取项目状态
   */
  getItemState(index: number): 'success' | 'error' | null {
    return this.itemStates()[index];
  }

  /**
   * 获取方法标签颜色
   */
  getMethodColor(method: string): string {
    const colors: Record<string, string> = {
      GET: 'bg-green-100 text-green-700',
      POST: 'bg-blue-100 text-blue-700',
      PUT: 'bg-yellow-100 text-yellow-700',
      PATCH: 'bg-purple-100 text-purple-700',
      DELETE: 'bg-red-100 text-red-700',
    };
    return colors[method] || 'bg-gray-100 text-gray-700';
  }
}
