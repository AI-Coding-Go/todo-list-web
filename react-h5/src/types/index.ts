/**
 * 类型定义文件
 * 定义应用中使用的所有接口类型
 */

/** 任务优先级 */
export type ETaskPriority = 'high' | 'medium' | 'low'

/** 任务状态 */
export type ETaskStatus = 'pending' | 'completed'

/** 任务数据接口 */
export interface ITask {
  /** 任务 ID */
  id: string
  /** 任务标题 */
  title: string
  /** 任务描述 */
  description: string
  /** 截止时间（时间戳） */
  dueTime: number | null
  /** 优先级 */
  priority: ETaskPriority
  /** 状态 */
  status: ETaskStatus
  /** 创建时间（时间戳） */
  createdAt: number
  /** 完成时间（时间戳） */
  completedAt: number | null
}

/** 任务筛选类型 */
export type ETaskFilter = 'all' | 'pending' | 'completed'

/** 任务排序类型 */
export type ETaskSort = 'latest' | 'due' | 'priority'

/** 路由参数接口 */
export interface IRouteParams {
  id: string
}
