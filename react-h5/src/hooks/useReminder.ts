/**
 * 提醒功能 Hook
 * 实现长轮询获取提醒、浏览器通知等功能
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import api from '@/services/api'
import type { ITodoTaskResponse } from '@/types/api'

interface IUseReminderReturn {
  /** 当前提醒列表 */
  reminders: ITodoTaskResponse[]
  /** 提醒开关是否开启 */
  enabled: boolean
  /** 设置提醒开关 */
  setEnabled: (enabled: boolean) => void
  /** 标记任务已提醒 */
  markAsReminded: (taskId: number) => void
  /** 清除提醒 */
  clearReminders: () => void
}

const REMINDER_INTERVAL = 30000 // 30 秒轮询一次
const STORAGE_KEY = 'h5_todo_reminder_enabled'
const REMINDED_TASKS_KEY = 'h5_todo_remined_tasks'

export function useReminder(): IUseReminderReturn {
  const [reminders, setReminders] = useState<ITodoTaskResponse[]>([])
  const [enabled, setEnabledState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? stored === 'true' : true
  })

  // 获取已提醒的任务 ID 集合
  const getRemindedTasks = useCallback(() => {
    const stored = localStorage.getItem(REMINDED_TASKS_KEY)
    return stored ? new Set<number>(JSON.parse(stored)) : new Set<number>()
  }, [])

  // 保存已提醒的任务 ID
  const saveRemindedTasks = useCallback((taskIds: Set<number>) => {
    localStorage.setItem(REMINDED_TASKS_KEY, JSON.stringify([...taskIds]))
  }, [])

  // 轮询定时器引用
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 请求浏览器通知权限
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // 显示浏览器通知
  const showBrowserNotification = useCallback((task: ITodoTaskResponse) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('待办任务提醒', {
        body: `${task.title}${task.deadlineFormatted ? ` - 截止：${task.deadlineFormatted}` : ''}`,
        icon: '/vite.svg',
        tag: `task-${task.id}`,
      })
    }
  }, [])

  // 获取提醒列表
  const fetchReminders = useCallback(async () => {
    if (!enabled) return

    try {
      const data = await api.getReminders()
      const remindedTasks = getRemindedTasks()

      // 过滤掉已提醒的任务
      const newReminders = data.filter((task) => !remindedTasks.has(task.id))

      if (newReminders.length > 0) {
        setReminders(newReminders)
        // 显示浏览器通知（仅第一条）
        showBrowserNotification(newReminders[0])
      }
    } catch (err) {
      console.error('获取提醒失败:', err)
    }
  }, [enabled, getRemindedTasks, showBrowserNotification])

  // 启动/停止轮询
  useEffect(() => {
    if (enabled) {
      // 立即执行一次
      fetchReminders()
      // 设置定时器
      intervalRef.current = setInterval(fetchReminders, REMINDER_INTERVAL)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setReminders([])
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, fetchReminders])

  // 请求通知权限（组件挂载时）
  useEffect(() => {
    if (enabled) {
      requestNotificationPermission()
    }
  }, [enabled, requestNotificationPermission])

  // 设置提醒开关
  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value)
    localStorage.setItem(STORAGE_KEY, String(value))
  }, [])

  // 标记任务已提醒
  const markAsReminded = useCallback((taskId: number) => {
    const remindedTasks = getRemindedTasks()
    remindedTasks.add(taskId)
    saveRemindedTasks(remindedTasks)
    setReminders((prev) => prev.filter((task) => task.id !== taskId))
  }, [getRemindedTasks, saveRemindedTasks])

  // 清除所有提醒
  const clearReminders = useCallback(() => {
    setReminders([])
  }, [])

  return {
    reminders,
    enabled,
    setEnabled,
    markAsReminded,
    clearReminders,
  }
}
