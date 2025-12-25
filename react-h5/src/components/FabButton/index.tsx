/**
 * 悬浮新增按钮组件
 * 固定在右下角，用于快速添加新任务
 */

interface IFabButtonProps {
  /** 点击事件 */
  onClick: () => void
}

export default function FabButton({ onClick }: IFabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center active:bg-blue-600 hover:bg-blue-600 transition-colors"
      aria-label="新增任务"
    >
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  )
}
