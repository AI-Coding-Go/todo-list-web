/**
 * 设置页面
 */
import React from 'react'
import Header from '@/components/Common/Header'
import { useSettingsStore } from '@/store/settingsStore'

const Settings: React.FC = () => {
  const { settings, toggleReminder } = useSettingsStore()
  
  // 处理提醒开关切换
  const handleReminderToggle = () => {
    toggleReminder()
  }
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header title="设置" />
      
      <div className="flex-1 overflow-y-auto">
        {/* 通知设置 */}
        <div className="bg-white mt-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">通知设置</h3>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">任务提醒</h4>
              <p className="text-xs text-gray-500 mt-1">允许任务截止前提醒</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.enableReminder}
                onChange={handleReminderToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        {/* 关于 */}
        <div className="bg-white mt-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">关于</h3>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700">版本</span>
              <span className="text-sm text-gray-500">1.0.0</span>
            </div>
            <div className="text-xs text-gray-500">
              <p>移动端H5待办清单应用</p>
              <p>基于React + TypeScript构建</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings