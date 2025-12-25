/**
 * API 服务模块
 * 封装所有后端接口调用方法
 */

import request from '@/utils/request'
import type {
  ITodoTaskResponse,
  ITodoTaskCreateRequest,
  ITodoTaskUpdateRequest,
  ITaskListResponse,
  IVoidResponse,
} from '@/types/api'

/**
 * 获取任务列表
 * GET /api/tasks
 */
export const getTaskList = (): Promise<ITaskListResponse> => {
  return request.get('/tasks')
}

/**
 * 获取单个任务
 * GET /api/tasks/{id}
 * @param id - 任务 ID
 */
export const getTaskById = (id: number): Promise<ITodoTaskResponse> => {
  return request.get(`/tasks/${id}`)
}

/**
 * 创建新任务
 * POST /api/tasks
 * @param data - 任务创建数据
 */
export const createTask = (data: ITodoTaskCreateRequest): Promise<ITodoTaskResponse> => {
  return request.post('/tasks', data)
}

/**
 * 更新任务
 * PUT /api/tasks/{id}
 * @param id - 任务 ID
 * @param data - 任务更新数据
 */
export const updateTask = (id: number, data: ITodoTaskUpdateRequest): Promise<ITodoTaskResponse> => {
  return request.put(`/tasks/${id}`, data)
}

/**
 * 删除任务
 * DELETE /api/tasks/{id}
 * @param id - 任务 ID
 */
export const deleteTask = (id: number): Promise<IVoidResponse> => {
  return request.delete(`/tasks/${id}`)
}

/**
 * 标记任务完成
 * PATCH /api/tasks/{id}/complete
 * @param id - 任务 ID
 */
export const markTaskComplete = (id: number): Promise<ITodoTaskResponse> => {
  return request.patch(`/tasks/${id}/complete`)
}

/**
 * 标记任务未完成
 * PATCH /api/tasks/{id}/pending
 * @param id - 任务 ID
 */
export const markTaskPending = (id: number): Promise<ITodoTaskResponse> => {
  return request.patch(`/tasks/${id}/pending`)
}

/**
 * 获取当前提醒
 * GET /api/reminders
 * 获取未来 30 分钟内到期的需要提醒的任务列表
 */
export const getReminders = (): Promise<ITaskListResponse> => {
  return request.get('/reminders')
}

// 导出所有 API 方法的统一对象
const api = {
  getTaskList,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markTaskComplete,
  markTaskPending,
  getReminders,
}

export default api
