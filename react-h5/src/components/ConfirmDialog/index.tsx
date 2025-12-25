/**
 * 确认弹窗组件
 * 用于二次确认危险操作（如删除任务）
 */

interface IConfirmDialogProps {
  /** 是否显示弹窗 */
  open: boolean
  /** 标题 */
  title: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认回调 */
  onConfirm: () => void
  /** 取消回调 */
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: IConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* 弹窗内容 */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 animate-fade-in">
        <h3 className="text-lg font-medium text-gray-900 text-center mb-6">{title}</h3>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium active:bg-gray-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium active:bg-blue-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
