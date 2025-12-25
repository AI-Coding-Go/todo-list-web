/**
 * 应用根组件
 */

import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ReminderBarComponent } from './shared/components/reminder-bar/reminder-bar.component';
import { ReminderService } from './core/services/reminder.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReminderBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);
  private reminderService = inject(ReminderService);

  /** 提醒消息列表 */
  reminders = this.reminderService.reminders;

  /** 关闭提醒 */
  onCloseReminder(): void {
    const currentReminders = this.reminders();
    if (currentReminders.length > 0) {
      // 标记第一个提醒为已提醒
      this.reminderService.markAsReminded(currentReminders[0].id);
    }
  }

  /** 稍后提醒 */
  onLaterReminder(): void {
    // 暂时关闭提醒，下次轮询时如果仍然存在会再次显示
    this.reminderService.clearReminders();
  }

  /** 查看任务 */
  onViewTask(taskId: number): void {
    this.router.navigate(['/task', taskId]);
  }
}
