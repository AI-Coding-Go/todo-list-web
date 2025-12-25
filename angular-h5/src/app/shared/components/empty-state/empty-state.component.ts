/**
 * 空状态提示组件
 * 用于列表为空或无数据时显示
 */

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  /** 图标类型 */
  type = input<'task' | 'statistics'>('task');
  /** 提示文字 */
  text = input('');
}
