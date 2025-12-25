/**
 * 顶部标题栏组件
 * 支持左侧返回按钮、中间标题、右侧操作按钮
 */

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  /** 标题文本 */
  title = input.required<string>();
  /** 是否显示返回按钮 */
  showBack = input<boolean>(false);
  /** 右侧操作按钮内容 */
  rightContent = input<string>('');
  /** 返回按钮点击事件 */
  back = output<void>();
  /** 右侧按钮点击事件 */
  rightClick = output<void>();
}
