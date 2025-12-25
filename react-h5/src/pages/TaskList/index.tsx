/**
 * 任务列表页
 * 展示任务列表，支持筛选、排序、操作等功能
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '@/hooks/useTasks'
import { useConfirm } from '@/hooks/useConfirm'
import { FILTER_OPTIONS, SORT_OPTIONS, BOTTOM_NAV_ITEMS } from '@/constants'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import FabButton from '@/components/FabButton'
import ConfirmDialog from '@/components/ConfirmDialog'
import EmptyState from '@/components/EmptyState'
import type { ITodoTaskResponse } from '@/types/api'
import type { ETaskPriority } from '@/types/api'

// 优先级颜色映射
const PRIORITY_COLORS: Record<ETaskPriority, string> = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW: 'bg-green-500',
}

export default function TaskList() {
  const navigate = useNavigate()
  const {
    tasks,
    loading,
    filter,
    sort,
    setFilter,
    setSort,
    toggleTaskStatus,
    removeTask,
  } = useTasks()

  const { open, title, confirm, close, handleConfirm } = useConfirm()
  const [showSortMenu, setShowSortMenu] = useState(false)

  // 处理删除任务
  const handleDelete = useCallback(async (id: number) => {
    const confirmed = await confirm('确定删除该任务？删除后不可恢复')
    if (confirmed) {
      try {
        await removeTask(id)
      } catch (err) {
        console.error('删除失败:', err)
      }
    }
  }, [confirm, removeTask])

  // 处理复选框点击
  const handleCheckboxChange = useCallback(async (task: ITodoTaskResponse) => {
    try {
      await toggleTaskStatus(task.id, task.status !== 'COMPLETED')
    } catch (err) {
      console.error('更新状态失败:', err)
    }
  }, [toggleTaskStatus])

  // 处理排序选择
  const handleSortSelect = useCallback((sortValue: string) => {
    setSort(sortValue as any)
    setShowSortMenu(false)
  }, [setSort])

  // 获取任务项样式
  const getTaskItemClass = (task: ITodoTaskResponse) => {
    const baseClass = 'bg-white rounded-lg p-4 mb-3 shadow-sm transition-colors'
    const completedClass = task.status === 'COMPLETED' ? 'opacity-60' : ''
    return `${baseClass} ${completedClass}`
  }

  // 格式化截止时间显示
  const formatDeadline = (task: ITodoTaskResponse) => {
    if (!task.deadlineFormatted) return null
    const isOverdue = task.overdue && task.status !== 'COMPLETED'
    return (
      <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
        {isOverdue ? '逾期 ' : ''}{task.deadlineFormatted}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      {/* 顶部标题栏 */}
      <TopBar title="待办清单" />

      {/* 主内容区 */}
      <main className="pt-14 px-4">
        {/* 筛选 Tab */}
        <div className="flex bg-white rounded-lg p-1 mb-4 shadow-sm">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value as any)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 排序按钮 */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            共 {tasks.length} 个任务
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 text-sm text-gray-600"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18M7 12h10M10 18h4" />
              </svg>
              {SORT_OPTIONS.find((s) => s.value === sort)?.label}
            </button>

            {/* 排序下拉菜单 */}
            {showSortMenu && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSortSelect(option.value)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      sort === option.value ? 'text-blue-500' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 任务列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-gray-400">加载中...</span>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState type="task" />
        ) : (
          <div className="pb-20">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={getTaskItemClass(task)}
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <div className="flex items-start gap-3">
                  {/* 复选框 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCheckboxChange(task)
                    }}
                    className="flex-shrink-0 mt-0.5"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.status === 'COMPLETED'
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {task.status === 'COMPLETED' && (
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* 任务内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* 优先级标签 */}
                      <span
                        className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority]}`}
                      />
                      {/* 任务标题 */}
                      <span className={`flex-1 text-sm ${
                        task.status === 'COMPLETED'
                          ? 'line-through text-gray-400'
                          : 'text-gray-900'
                      }`}>
                        {task.title.length > 50 ? task.title.slice(0, 50) + '...' : task.title}
                      </span>
                    </div>

                    {/* 截止时间 */}
                    {formatDeadline(task)}
                  </div>

                  {/* 删除按钮 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(task.id)
                    }}
                    className="flex-shrink-0 p-1 text-gray-400 active:text-red-500"
                  >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 悬浮新增按钮 */}
      <FabButton onClick={() => navigate('/task/new')} />

      {/* 底部导航栏 */}
      <BottomNav items={BOTTOM_NAV_ITEMS} />

      {/* 确认弹窗 */}
      <ConfirmDialog
        open={open}
        title={title}
        onCancel={close}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
