/**
 * 确认弹窗管理 Hook
 * 用于管理二次确认弹窗的状态
 */

import { useState, useCallback, useRef } from 'react'

interface IUseConfirmReturn {
  /** 是否显示弹窗 */
  open: boolean
  /** 弹窗标题 */
  title: string
  /** 显示确认弹窗 */
  confirm: (title: string) => Promise<boolean>
  /** 关闭弹窗 */
  close: () => void
  /** 确认操作 */
  handleConfirm: () => void
}

export function useConfirm(): IUseConfirmReturn {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const resolverRef = useRef<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = useCallback((titleText: string): Promise<boolean> => {
    setTitle(titleText)
    setOpen(true)

    return new Promise((resolve) => {
      resolverRef.current = { resolve }
    })
  }, [])

  const confirmWrapper = useCallback((confirmed: boolean) => {
    setOpen(false)
    if (resolverRef.current) {
      resolverRef.current.resolve(confirmed)
      resolverRef.current = null
    }
  }, [])

  return {
    open,
    title,
    confirm,
    close: () => confirmWrapper(false),
    handleConfirm: () => confirmWrapper(true),
  }
}
