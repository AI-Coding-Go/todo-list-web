/**
 * 提醒悬浮条组件
 * 在页面顶部显示任务提醒信息
 */

import type { ITodoTaskResponse } from '@/types/api'

interface IReminderBarProps {
  /** 提醒任务列表 */
  reminders: ITodoTaskResponse[]
  /** 点击查看任务 */
  onViewTask: (taskId: number) => void
  /** 稍后提醒 */
  onLater: () => void
  /** 关闭提醒 */
  onClose: () => void
}

export default function ReminderBar({
  reminders,
  onViewTask,
  onLater,
  onClose,
}: IReminderBarProps) {
  if (reminders.length === 0) return null

  const currentReminder = reminders[0]

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-50 border-b border-amber-200 animate-slide-down">
      <div className="px-4 py-3 flex items-start gap-3">
        {/* 提醒图标 */}
        <div className="flex-shrink-0 mt-0.5">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>

        {/* 提醒内容 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 truncate">{currentReminder.title}</p>
          <p className="text-xs text-amber-700 mt-0.5">
            {currentReminder.deadlineFormatted
              ? `截止时间：${currentReminder.deadlineFormatted}`
              : '即将到期'}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewTask(currentReminder.id)}
            className="text-xs px-3 py-1.5 bg-amber-500 text-white rounded-full active:bg-amber-600"
          >
            查看
          </button>
          <button
            type="button"
            onClick={onLater}
            className="text-xs px-3 py-1.5 bg-white text-amber-700 rounded-full active:bg-amber-50"
          >
            稍后
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-amber-500 active:text-amber-700"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
