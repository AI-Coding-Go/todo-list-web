/**
 * 应用设置状态管理
 */
import { create } from 'zustand'
import { ISettings } from '@/types'
import { settingsStorage } from '@/utils/storage'

interface ISettingsStore {
  settings: ISettings
  updateSettings: (updates: Partial<ISettings>) => void
  toggleReminder: () => void
  toggleDarkMode: () => void
}

export const useSettingsStore = create<ISettingsStore>((set, get) => ({
  // 初始设置
  settings: settingsStorage.getSettings(),
  
  // 更新设置
  updateSettings: (updates) => {
    const newSettings = { ...get().settings, ...updates }
    set({ settings: newSettings })
    settingsStorage.saveSettings(newSettings)
  },
  
  // 切换提醒开关
  toggleReminder: () => {
    const { enableReminder } = get().settings
    set((state) => ({
      settings: { ...state.settings, enableReminder: !enableReminder }
    }))
    settingsStorage.updateSettings({ enableReminder: !enableReminder })
  },
  
  // 切换深色模式
  toggleDarkMode: () => {
    const { darkMode } = get().settings
    set((state) => ({
      settings: { ...state.settings, darkMode: !darkMode }
    }))
    settingsStorage.updateSettings({ darkMode: !darkMode })
  },
}))