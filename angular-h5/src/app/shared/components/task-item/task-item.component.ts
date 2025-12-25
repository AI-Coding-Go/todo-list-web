/**
 * 任务列表项组件
 */

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  /** 任务标题 */
  title = input.required<string>();
  /** 是否已完成 */
  completed = input<boolean>(false);
}
