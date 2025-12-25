/**
 * 顶部导航栏组件
 * 支持左侧返回按钮、中间标题、右侧操作按钮
 */

import type { ReactNode } from 'react'

interface ITopBarProps {
  /** 标题文字 */
  title: string
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 返回按钮点击事件 */
  onBack?: () => void
  /** 右侧操作按钮内容 */
  rightContent?: ReactNode
  /** 右侧操作按钮点击事件 */
  onRightClick?: () => void
}

export default function TopBar({
  title,
  showBack = false,
  onBack,
  rightContent,
  onRightClick,
}: ITopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* 左侧返回按钮 */}
      <div className="w-16 flex items-center">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-2 text-gray-600 active:text-gray-900"
            aria-label="返回"
          >
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* 中间标题 */}
      <h1 className="flex-1 text-center text-lg font-medium text-gray-900 truncate px-4">{title}</h1>

      {/* 右侧操作按钮 */}
      <div className="w-16 flex justify-end">
        {rightContent && (
          <button
            type="button"
            onClick={onRightClick}
            className="text-gray-600 active:text-gray-900"
          >
            {rightContent}
          </button>
        )}
      </div>
    </header>
  )
}
