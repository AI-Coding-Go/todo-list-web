/**
 * 任务详情页
 * 展示任务的完整信息，支持编辑、删除、标记状态等操作
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/services/api'
import { useTasks } from '@/hooks/useTasks'
import TopBar from '@/components/TopBar'
import ConfirmDialog from '@/components/ConfirmDialog'
import type { ITodoTaskResponse, ETaskPriority } from '@/types/api'

// 优先级颜色映射
const PRIORITY_COLORS: Record<ETaskPriority, { bg: string; text: string }> = {
  HIGH: { bg: 'bg-red-100', text: 'text-red-600' },
  MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-600' },
  LOW: { bg: 'bg-green-100', text: 'text-green-600' },
}

const PRIORITY_LABELS: Record<ETaskPriority, string> = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
}

export default function TaskDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { updateTask, removeTask } = useTasks()

  const [task, setTask] = useState<ITodoTaskResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // 确认弹窗状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 加载任务详情
  const loadTask = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await api.getTaskById(Number(id))
      setTask(data)
    } catch (err) {
      console.error('加载任务失败:', err)
      navigate('/', { replace: true })
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    loadTask()
  }, [loadTask])

  // 处理返回
  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  // 处理编辑
  const handleEdit = useCallback(() => {
    navigate(`/task/edit/${id}`)
  }, [id, navigate])

  // 处理删除
  const handleDelete = useCallback(async () => {
    if (!task) return

    try {
      setActionLoading(true)
      await removeTask(task.id)
      navigate('/')
    } catch (err) {
      console.error('删除失败:', err)
      alert('删除失败，请重试')
    } finally {
      setActionLoading(false)
    }
  }, [task, removeTask, navigate])

  // 处理标记状态切换
  const handleToggleStatus = useCallback(async () => {
    if (!task) return

    try {
      setActionLoading(true)
      const updatedTask = task.status === 'COMPLETED'
        ? await api.markTaskPending(task.id)
        : await api.markTaskComplete(task.id)
      setTask(updatedTask)
      updateTask(task.id, updatedTask)
    } catch (err) {
      console.error('更新状态失败:', err)
      alert('更新状态失败，请重试')
    } finally {
      setActionLoading(false)
    }
  }, [task, updateTask])

  // 格式化日期时间
  const formatFullDateTime = useCallback((dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">加载中...</span>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">任务不存在</span>
      </div>
    )
  }

  const priorityConfig = PRIORITY_COLORS[task.priority]
  const isOverdue = task.overdue && task.status !== 'COMPLETED'

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      {/* 顶部导航栏 */}
      <TopBar
        title="任务详情"
        showBack
        onBack={handleBack}
      />

      {/* 主内容区 */}
      <main className="pt-14 px-4">
        {/* 任务标题卡片 */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="flex items-start gap-3">
            {/* 优先级标签 */}
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
              {PRIORITY_LABELS[task.priority]}优先级
            </span>
          </div>
          <h1 className="text-xl font-medium text-gray-900 mt-2">{task.title}</h1>

          {/* 状态 */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              task.status === 'COMPLETED'
                ? 'bg-green-100 text-green-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {task.status === 'COMPLETED' ? '已完成' : '未完成'}
            </span>
            {task.status === 'COMPLETED' && task.completedAtFormatted && (
              <span className="text-xs text-gray-400">
                完成于 {task.completedAtFormatted}
              </span>
            )}
          </div>
        </div>

        {/* 详细信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          {/* 截止时间 */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">截止时间</span>
            <span className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-900'}`}>
              {task.deadlineFormatted || '未设置'}
              {isOverdue && <span className="ml-1">（已逾期）</span>}
            </span>
          </div>

          {/* 创建时间 */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">创建时间</span>
            <span className="text-sm text-gray-900">{formatFullDateTime(task.createdAt)}</span>
          </div>

          {/* 更新时间 */}
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">更新时间</span>
            <span className="text-sm text-gray-900">{formatFullDateTime(task.updatedAt)}</span>
          </div>
        </div>

        {/* 任务描述 */}
        {task.description && (
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="text-sm text-gray-500 mb-2">任务描述</h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 标记状态按钮 */}
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={actionLoading}
            className="w-full p-4 border-b border-gray-100 flex items-center justify-between active:bg-gray-50 disabled:opacity-50"
          >
            <span className="text-sm text-gray-900">
              {task.status === 'COMPLETED' ? '标记为未完成' : '标记为已完成'}
            </span>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {task.status === 'COMPLETED' ? (
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              ) : (
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </button>

          {/* 编辑按钮 */}
          <button
            type="button"
            onClick={handleEdit}
            className="w-full p-4 border-b border-gray-100 flex items-center justify-between active:bg-gray-50"
          >
            <span className="text-sm text-gray-900">编辑任务</span>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* 删除按钮 */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 flex items-center justify-between active:bg-gray-50"
          >
            <span className="text-sm text-red-500">删除任务</span>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </main>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="确定删除该任务？删除后不可恢复"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
