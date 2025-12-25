/**
 * 任务数据管理 Hook
 * 封装任务列表的获取、筛选、排序等操作
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import api from '@/services/api'
import type { ITodoTaskResponse, ETaskStatus } from '@/types/api'
import type { ETaskFilter, ETaskSort } from '@/types'

interface IUseTasksReturn {
  /** 任务列表 */
  tasks: ITodoTaskResponse[]
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
  /** 当前筛选类型 */
  filter: ETaskFilter
  /** 当前排序类型 */
  sort: ETaskSort
  /** 设置筛选类型 */
  setFilter: (filter: ETaskFilter) => void
  /** 设置排序类型 */
  setSort: (sort: ETaskSort) => void
  /** 重新加载任务列表 */
  refresh: () => Promise<void>
  /** 标记任务完成/未完成 */
  toggleTaskStatus: (id: number, completed: boolean) => Promise<void>
  /** 删除任务 */
  removeTask: (id: number) => Promise<void>
  /** 添加新任务到列表 */
  addTask: (task: ITodoTaskResponse) => void
  /** 更新任务 */
  updateTask: (id: number, task: ITodoTaskResponse) => void
}

// 优先级权重
const PRIORITY_WEIGHT: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
}

export function useTasks(): IUseTasksReturn {
  const [tasks, setTasks] = useState<ITodoTaskResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<ETaskFilter>('all')
  const [sort, setSort] = useState<ETaskSort>('latest')

  // 获取任务列表
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getTaskList()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 初始化加载
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // 筛选后的任务列表
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks
    const status: ETaskStatus = filter === 'completed' ? 'COMPLETED' : 'PENDING'
    return tasks.filter((task) => task.status === status)
  }, [tasks, filter])

  // 排序后的任务列表
  const sortedTasks = useMemo(() => {
    const result = [...filteredTasks]

    switch (sort) {
      case 'latest':
        // 按创建时间倒序
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'due':
        // 按截止时间正序，无截止时间的排最后
        result.sort((a, b) => {
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        })
        break
      case 'priority':
        // 按优先级排序，同优先级按创建时间倒序
        result.sort((a, b) => {
          const weightDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
          if (weightDiff !== 0) return weightDiff
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        break
      default:
        break
    }

    return result
  }, [filteredTasks, sort])

  // 标记任务完成/未完成
  const toggleTaskStatus = useCallback(async (id: number, completed: boolean) => {
    try {
      const updatedTask = completed
        ? await api.markTaskComplete(id)
        : await api.markTaskPending(id)
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
    } catch (err) {
      throw err
    }
  }, [])

  // 删除任务
  const removeTask = useCallback(async (id: number) => {
    try {
      await api.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      throw err
    }
  }, [])

  // 添加新任务到列表
  const addTask = useCallback((task: ITodoTaskResponse) => {
    setTasks((prev) => [task, ...prev])
  }, [])

  // 更新任务
  const updateTask = useCallback((id: number, updatedTask: ITodoTaskResponse) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
  }, [])

  return {
    tasks: sortedTasks,
    loading,
    error,
    filter,
    sort,
    setFilter,
    setSort,
    refresh: fetchTasks,
    toggleTaskStatus,
    removeTask,
    addTask,
    updateTask,
  }
}
