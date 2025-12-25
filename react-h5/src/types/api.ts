/**
 * API 接口相关类型定义
 * 定义所有 API 请求和响应的数据结构
 */

/** 错误信息接口 */
export interface IErrorInfo {
  /** 错误码 */
  code: string
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details: string
}

/** 统一 API 响应格式 */
export interface IApiResponse<T = unknown> {
  /** 请求是否成功 */
  success: boolean
  /** 响应数据 */
  data: T
  /** 响应消息 */
  message: string
  /** 错误信息（可选） */
  error?: IErrorInfo
  /** 响应时间戳 */
  timestamp: string
}

/** 任务优先级 */
export type ETaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'

/** 任务状态 */
export type ETaskStatus = 'PENDING' | 'COMPLETED'

/** 任务响应接口 */
export interface ITodoTaskResponse {
  /** 任务 ID */
  id: number
  /** 任务标题 */
  title: string
  /** 任务描述 */
  description: string
  /** 任务状态 */
  status: ETaskStatus
  /** 状态描述 */
  statusDescription: string
  /** 优先级 */
  priority: ETaskPriority
  /** 优先级描述 */
  priorityDescription: string
  /** 优先级颜色 */
  priorityColor: string
  /** 截止时间（ISO 8601 格式） */
  deadline: string | null
  /** 创建时间（ISO 8601 格式） */
  createdAt: string
  /** 更新时间（ISO 8601 格式） */
  updatedAt: string
  /** 完成时间（ISO 8601 格式） */
  completedAt: string | null
  /** 是否逾期 */
  overdue: boolean
  /** 剩余分钟数 */
  remainingMinutes: number | null
  /** 格式化的截止时间 */
  deadlineFormatted: string | null
  /** 格式化的完成时间 */
  completedAtFormatted: string | null
}

/** 创建任务请求接口 */
export interface ITodoTaskCreateRequest {
  /** 任务标题（必填） */
  title: string
  /** 任务描述 */
  description?: string
  /** 优先级 */
  priority?: ETaskPriority
  /** 截止时间（ISO 8601 格式） */
  deadline?: string
}

/** 更新任务请求接口 */
export interface ITodoTaskUpdateRequest {
  /** 任务标题 */
  title?: string
  /** 任务描述 */
  description?: string
  /** 优先级 */
  priority?: ETaskPriority
  /** 截止时间（ISO 8601 格式） */
  deadline?: string
}

/** 任务列表响应类型 */
export type ITaskListResponse = ITodoTaskResponse[]

/** 空响应类型（用于删除等操作） */
export type IVoidResponse = Record<string, never>
