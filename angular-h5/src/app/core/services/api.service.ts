/**
 * API 服务
 * 封装所有后端接口调用方法
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  ITodoTaskResponse,
  ITodoTaskCreateRequest,
  ITodoTaskUpdateRequest,
  IApiResponse,
  ITaskListResponse,
  IVoidResponse,
} from '../../shared/models/api.model';

/**
 * API 基础路径
 */
const API_BASE_URL = '/api';

/**
 * API 服务类
 * 提供所有后端接口的调用方法
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * 获取任务列表
   * GET /api/tasks
   */
  getTaskList(): Observable<ITaskListResponse> {
    return this.http.get<IApiResponse<ITaskListResponse>>(`${API_BASE_URL}/tasks`).pipe(map((res) => res.data));
  }

  /**
   * 获取单个任务
   * GET /api/tasks/{id}
   * @param id - 任务 ID
   */
  getTaskById(id: number): Observable<ITodoTaskResponse> {
    return this.http
      .get<IApiResponse<ITodoTaskResponse>>(`${API_BASE_URL}/tasks/${id}`)
      .pipe(map((res) => res.data));
  }

  /**
   * 创建新任务
   * POST /api/tasks
   * @param data - 任务创建数据
   */
  createTask(data: ITodoTaskCreateRequest): Observable<ITodoTaskResponse> {
    return this.http
      .post<IApiResponse<ITodoTaskResponse>>(`${API_BASE_URL}/tasks`, data)
      .pipe(map((res) => res.data));
  }

  /**
   * 更新任务
   * PUT /api/tasks/{id}
   * @param id - 任务 ID
   * @param data - 任务更新数据
   */
  updateTask(id: number, data: ITodoTaskUpdateRequest): Observable<ITodoTaskResponse> {
    return this.http
      .put<IApiResponse<ITodoTaskResponse>>(`${API_BASE_URL}/tasks/${id}`, data)
      .pipe(map((res) => res.data));
  }

  /**
   * 删除任务
   * DELETE /api/tasks/{id}
   * @param id - 任务 ID
   */
  deleteTask(id: number): Observable<IVoidResponse> {
    return this.http.delete<IApiResponse<IVoidResponse>>(`${API_BASE_URL}/tasks/${id}`).pipe(map((res) => res.data));
  }

  /**
   * 标记任务完成
   * PATCH /api/tasks/{id}/complete
   * @param id - 任务 ID
   */
  markTaskComplete(id: number): Observable<ITodoTaskResponse> {
    return this.http
      .patch<IApiResponse<ITodoTaskResponse>>(`${API_BASE_URL}/tasks/${id}/complete`, {})
      .pipe(map((res) => res.data));
  }

  /**
   * 标记任务未完成
   * PATCH /api/tasks/{id}/pending
   * @param id - 任务 ID
   */
  markTaskPending(id: number): Observable<ITodoTaskResponse> {
    return this.http
      .patch<IApiResponse<ITodoTaskResponse>>(`${API_BASE_URL}/tasks/${id}/pending`, {})
      .pipe(map((res) => res.data));
  }

  /**
   * 获取当前提醒
   * GET /api/reminders
   * 获取未来 30 分钟内到期的需要提醒的任务列表
   */
  getReminders(): Observable<ITaskListResponse> {
    return this.http.get<IApiResponse<ITaskListResponse>>(`${API_BASE_URL}/reminders`).pipe(map((res) => res.data));
  }
}
