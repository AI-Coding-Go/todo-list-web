/**
 * 本地存储工具类
 */
import { ITodo, ISettings, IReminder } from '@/types'

const STORAGE_KEYS = {
  TODOS: 'todos',
  SETTINGS: 'settings',
  REMINDERS: 'reminders',
}

// 默认设置
const DEFAULT_SETTINGS: ISettings = {
  enableReminder: true,
  darkMode: false,
}

/**
 * 任务相关存储操作
 */
export const todoStorage = {
  /**
   * 获取所有任务
   */
  getTodos(): ITodo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TODOS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取任务列表失败:', error)
      return []
    }
  },

  /**
   * 保存任务列表
   */
  saveTodos(todos: ITodo[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos))
    } catch (error) {
      console.error('保存任务列表失败:', error)
    }
  },

  /**
   * 添加任务
   */
  addTodo(todo: ITodo): void {
    const todos = this.getTodos()
    todos.push(todo)
    this.saveTodos(todos)
  },

  /**
   * 更新任务
   */
  updateTodo(id: string, updates: Partial<ITodo>): void {
    const todos = this.getTodos()
    const index = todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates }
      this.saveTodos(todos)
    }
  },

  /**
   * 删除任务
   */
  deleteTodo(id: string): void {
    const todos = this.getTodos().filter(todo => todo.id !== id)
    this.saveTodos(todos)
  },

  /**
   * 根据ID获取任务
   */
  getTodoById(id: string): ITodo | null {
    const todos = this.getTodos()
    return todos.find(todo => todo.id === id) || null
  },
}

/**
 * 设置相关存储操作
 */
export const settingsStorage = {
  /**
   * 获取设置
   */
  getSettings(): ISettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS
    } catch (error) {
      console.error('获取设置失败:', error)
      return DEFAULT_SETTINGS
    }
  },

  /**
   * 保存设置
   */
  saveSettings(settings: ISettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('保存设置失败:', error)
    }
  },

  /**
   * 更新设置
   */
  updateSettings(updates: Partial<ISettings>): void {
    const settings = this.getSettings()
    this.saveSettings({ ...settings, ...updates })
  },
}

/**
 * 提醒相关存储操作
 */
export const reminderStorage = {
  /**
   * 获取所有提醒
   */
  getReminders(): IReminder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取提醒列表失败:', error)
      return []
    }
  },

  /**
   * 保存提醒列表
   */
  saveReminders(reminders: IReminder[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders))
    } catch (error) {
      console.error('保存提醒列表失败:', error)
    }
  },

  /**
   * 添加提醒
   */
  addReminder(reminder: IReminder): void {
    const reminders = this.getReminders()
    reminders.push(reminder)
    this.saveReminders(reminders)
  },

  /**
   * 标记提醒为已触发
   */
  markAsTriggered(id: string): void {
    const reminders = this.getReminders()
    const index = reminders.findIndex(r => r.id === id)
    if (index !== -1) {
      reminders[index].triggered = true
      this.saveReminders(reminders)
    }
  },

  /**
   * 清理已触发的旧提醒
   */
  cleanupOldReminders(): void {
    const now = new Date().toISOString()
    const reminders = this.getReminders().filter(r => {
      // 保留未触发的提醒和7天内触发的提醒
      if (!r.triggered) return true
      const reminderDate = new Date(r.createdAt)
      reminderDate.setDate(reminderDate.getDate() + 7)
      return reminderDate.toISOString() > now
    })
    this.saveReminders(reminders)
  },
}