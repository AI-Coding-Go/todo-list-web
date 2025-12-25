/**
 * 悬浮新增按钮组件
 */

import { Component, output } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  imports: [],
  templateUrl: './fab-button.component.html',
  styleUrl: './fab-button.component.scss'
})
export class FabButtonComponent {
  /** 点击事件 */
  click = output<void>();
}
