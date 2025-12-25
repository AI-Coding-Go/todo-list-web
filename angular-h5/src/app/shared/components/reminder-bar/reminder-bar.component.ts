/**
 * 提醒悬浮条组件
 * 在页面顶部显示任务提醒信息
 */

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ITodoTaskResponse } from '../../models/api.model';

@Component({
  selector: 'app-reminder-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reminder-bar.component.html',
  styleUrl: './reminder-bar.component.scss'
})
export class ReminderBarComponent {
  /** 提醒任务列表 */
  reminders = input.required<ITodoTaskResponse[]>();
  /** 点击查看任务 */
  onViewTask = output<number>();
  /** 稍后提醒 */
  onLater = output<void>();
  /** 关闭提醒 */
  onClose = output<void>();
}
