/**
 * 确认弹窗组件
 * 用于二次确认危险操作（如删除任务）
 */

import { Component, output, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  /** 是否显示弹窗 */
  open = input.required<boolean>();
  /** 标题 */
  title = input.required<string>();
  /** 确认按钮文字 */
  confirmText = input('确定');
  /** 取消按钮文字 */
  cancelText = input('取消');
  /** 确认事件 */
  confirm = output<void>();
  /** 取消事件 */
  cancel = output<void>();
}
