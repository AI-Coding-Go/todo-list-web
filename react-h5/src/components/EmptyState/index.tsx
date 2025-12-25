/**
 * 空状态提示组件
 * 用于列表为空或无数据时显示
 */

interface IEmptyStateProps {
  /** 图标类型 */
  type?: 'task' | 'statistics'
  /** 提示文字 */
  text?: string
}

export default function EmptyState({ type = 'task', text }: IEmptyStateProps) {
  const defaultText = type === 'task' ? '暂无任务，点击右下角添加' : '暂无统计数据'

  // 任务图标
  const taskIcon = (
    <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth={1.5}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )

  // 统计图标
  const statisticsIcon = (
    <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth={1.5}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  )

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="mb-4">{type === 'task' ? taskIcon : statisticsIcon}</div>
      <p className="text-gray-400 text-sm">{text || defaultText}</p>
    </div>
  )
}
