/**
 * 设置页
 * 包含提醒开关等应用设置
 */

import { useState, useEffect, useCallback } from 'react'
import TopBar from '@/components/TopBar'
import { BOTTOM_NAV_ITEMS } from '@/constants'
import BottomNav from '@/components/BottomNav'

const STORAGE_KEY = 'h5_todo_reminder_enabled'

export default function Settings() {
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  // 初始化设置
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setReminderEnabled(stored !== null ? stored === 'true' : true)

    // 获取通知权限状态
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // 处理提醒开关切换
  const handleReminderToggle = useCallback(async () => {
    const newValue = !reminderEnabled

    if (newValue && 'Notification' in window && Notification.permission === 'default') {
      // 用户开启提醒时请求通知权限
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      if (permission === 'granted') {
        setReminderEnabled(true)
        localStorage.setItem(STORAGE_KEY, 'true')
      } else if (permission === 'denied') {
        // 用户拒绝通知权限，但仍开启应用内提醒
        setReminderEnabled(true)
        localStorage.setItem(STORAGE_KEY, 'true')
      }
    } else {
      setReminderEnabled(newValue)
      localStorage.setItem(STORAGE_KEY, String(newValue))
    }
  }, [reminderEnabled])

  // 获取通知权限状态文本
  const getPermissionText = useCallback(() => {
    if (!('Notification' in window)) {
      return '当前浏览器不支持通知'
    }
    switch (notificationPermission) {
      case 'granted':
        return '已授权'
      case 'denied':
        return '已拒绝'
      case 'default':
        return '未设置'
      default:
        return '未知'
    }
  }, [notificationPermission])

  // 获取通知权限状态颜色
  const getPermissionColor = useCallback(() => {
    switch (notificationPermission) {
      case 'granted':
        return 'text-green-500'
      case 'denied':
        return 'text-red-500'
      default:
        return 'text-gray-400'
    }
  }, [notificationPermission])

  // 处理通知权限设置
  const handleNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }, [])

  // 应用版本信息
  const appVersion = '1.0.0'

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      {/* 顶部标题栏 */}
      <TopBar title="设置" />

      {/* 主内容区 */}
      <main className="pt-14 px-4">
        {/* 提醒设置 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">提醒设置</h3>
          </div>

          {/* 提醒开关 */}
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-900">任务提醒</div>
              <div className="text-xs text-gray-500 mt-1">
                在任务即将到期或逾期时发送提醒
              </div>
            </div>
            <button
              type="button"
              onClick={handleReminderToggle}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                reminderEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 浏览器通知权限 */}
          {'Notification' in window && (
            <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-900">桌面通知</div>
                <div className="text-xs text-gray-500 mt-1">
                  允许浏览器发送桌面通知
                </div>
              </div>
              <button
                type="button"
                onClick={handleNotificationPermission}
                className="text-sm"
                disabled={notificationPermission === 'granted'}
              >
                <span className={getPermissionColor()}>{getPermissionText()}</span>
                {notificationPermission !== 'granted' && (
                  <svg className="inline-block ml-1" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">关于</h3>
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-900">版本号</span>
            <span className="text-sm text-gray-500">v{appVersion}</span>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">使用说明</h3>
          </div>

          <div className="px-4 py-4">
            <div className="text-sm text-gray-600 space-y-3">
              <p>• 点击右下角悬浮按钮可快速添加新任务</p>
              <p>• 任务列表支持按状态筛选和多种方式排序</p>
              <p>• 点击任务卡片可查看详情或进行编辑</p>
              <p>• 统计页面可查看任务完成情况和趋势</p>
              <p>• 开启提醒后，系统会在任务即将到期时通知您</p>
            </div>
          </div>
        </div>
      </main>

      {/* 底部导航栏 */}
      <BottomNav items={BOTTOM_NAV_ITEMS} />
    </div>
  )
}
