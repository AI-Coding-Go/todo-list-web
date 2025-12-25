/**
 * 表单验证工具类
 */

/**
 * 验证任务标题
 * @param title 任务标题
 */
export function validateTitle(title: string): { valid: boolean; message: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, message: '请输入任务标题' };
  }
  if (title.length > 50) {
    return { valid: false, message: '任务标题不能超过50个字符' };
  }
  return { valid: true, message: '' };
}

/**
 * 验证任务描述
 * @param description 任务描述
 */
export function validateDescription(description: string): { valid: boolean; message: string } {
  if (description.length > 500) {
    return { valid: false, message: '任务描述不能超过500个字符' };
  }
  return { valid: true, message: '' };
}
