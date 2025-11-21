/**
 * 日期时间处理工具
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期时间为 MM-DD HH:MM
 */
export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return ''
  return dayjs(dateString).format('MM-DD HH:mm')
}

/**
 * 格式化完整日期时间为 YYYY-MM-DD HH:MM
 */
export const formatFullDateTime = (dateString?: string): string => {
  if (!dateString) return ''
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return dayjs(dateString).format('YYYY-MM-DD')
}

/**
 * 检查日期是否已过期
 */
export const isOverdue = (dueDateString?: string): boolean => {
  if (!dueDateString) return false
  return dayjs(dueDateString).isBefore(dayjs())
}

/**
 * 获取相对时间
 */
export const getRelativeTime = (dateString?: string): string => {
  if (!dateString) return ''
  return dayjs(dateString).fromNow()
}

/**
 * 获取今天、明天、后天的日期字符串
 */
export const getTodayTomorrow = (): {
  today: string
  tomorrow: string
  dayAfterTomorrow: string
} => {
  const today = dayjs()
  return {
    today: today.format('YYYY-MM-DD'),
    tomorrow: today.add(1, 'day').format('YYYY-MM-DD'),
    dayAfterTomorrow: today.add(2, 'day').format('YYYY-MM-DD'),
  }
}

/**
 * 获取近7天的日期数组
 */
export const getRecent7Days = (): Array<{ date: string; label: string }> => {
  const result = []
  const today = dayjs()
  
  for (let i = 6; i >= 0; i--) {
    const date = today.subtract(i, 'day')
    result.push({
      date: date.format('YYYY-MM-DD'),
      label: date.format(i === 0 ? '今天' : i === 1 ? '昨天' : 'MM-DD'),
    })
  }
  
  return result
}

/**
 * 检查是否是今天
 */
export const isToday = (dateString?: string): boolean => {
  if (!dateString) return false
  return dayjs(dateString).isSame(dayjs(), 'day')
}

/**
 * 检查是否是明天
 */
export const isTomorrow = (dateString?: string): boolean => {
  if (!dateString) return false
  return dayjs(dateString).isSame(dayjs().add(1, 'day'), 'day')
}

/**
 * 检查是否是后天
 */
export const isDayAfterTomorrow = (dateString?: string): boolean => {
  if (!dateString) return false
  return dayjs(dateString).isSame(dayjs().add(2, 'day'), 'day')
}

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}