/**
 * 日期工具类
 * 基于 day.js 处理日期相关操作
 */

import dayjs from 'dayjs';

/**
 * 格式化日期时间
 * @param timestamp 时间戳
 * @param format 格式模板，默认 'YYYY-MM-DD HH:mm'
 */
export function formatDateTime(timestamp: number, format = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(timestamp).format(format);
}

/**
 * 格式化日期时间（短格式）
 * @param timestamp 时间戳
 */
export function formatDateTimeShort(timestamp: number): string {
  return dayjs(timestamp).format('MM-DD HH:mm');
}

/**
 * 获取当前时间戳
 */
export function now(): number {
  return dayjs().valueOf();
}

/**
 * 判断是否逾期
 * @param dueTime 截止时间戳
 */
export function isOverdue(dueTime: number | null): boolean {
  if (!dueTime) return false;
  return dayjs(dueTime).isBefore(dayjs());
}
