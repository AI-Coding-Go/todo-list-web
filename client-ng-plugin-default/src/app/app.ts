/**
 * 主应用组件
 * 移动端H5待办清单应用
 */

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App implements OnInit {
  /** 应用标题 */
  readonly title = '待办清单';

  ngOnInit(): void {
    this.initializeApp();
  }

  /**
   * 初始化应用
   */
  private initializeApp(): void {
    // 设置应用基本信息
    this.setAppMeta();
    
    // 初始化主题
    this.initializeTheme();
    
    // 初始化字体
    this.initializeFont();
  }

  /**
   * 设置应用元信息
   */
  private setAppMeta(): void {
    // 设置页面标题
    document.title = this.title;
    
    // 设置视口
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // 设置状态栏样式（iOS）
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', '#007aff');
    }
  }

  /**
   * 初始化主题
   */
  private initializeTheme(): void {
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('todo_theme');
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // 应用主题
    document.body.classList.toggle('dark-theme', theme === 'dark');
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!savedTheme) {
        document.body.classList.toggle('dark-theme', e.matches);
      }
    });
  }

  /**
   * 初始化字体
   */
  private initializeFont(): void {
    // 设置字体族
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  }
}
