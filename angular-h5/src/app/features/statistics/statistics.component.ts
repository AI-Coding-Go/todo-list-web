/**
 * 数据统计页组件
 * 使用 Chart.js 展示任务完成率、趋势图和状态分布
 */

import { Component, inject, OnInit, AfterViewInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import type { ITodoTaskResponse, EApiTaskPriority } from '../../shared/models/api.model';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  PieController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  PieController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
);

/** 图表类型 */
type EChartType = 'completion' | 'trend' | 'distribution';

/** Tab 选项 */
const TAB_OPTIONS = [
  { value: 'completion' as const, label: '完成率' },
  { value: 'trend' as const, label: '趋势图' },
  { value: 'distribution' as const, label: '状态分布' }
];

/** 图表颜色 */
const CHART_COLORS = {
  blue: 'rgb(59, 130, 246)',
  green: 'rgb(34, 197, 94)',
  amber: 'rgb(245, 158, 11)',
  red: 'rgb(239, 68, 68)',
  gray: 'rgb(156, 163, 175)'
};

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, TopBarComponent, EmptyStateComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  /** 当前图表类型 */
  chartType: EChartType = 'completion';
  /** 任务列表 */
  tasks: ITodoTaskResponse[] = [];
  /** 加载状态 */
  loading = true;

  /** Tab 选项 */
  tabOptions = TAB_OPTIONS;

  /** 当前图表标题 */
  chartTitle = computed(() => {
    return TAB_OPTIONS.find(t => t.value === this.chartType)?.label || '';
  });

  /** 图表容器引用 */
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  /** 图表实例 */
  private chartInstance: ChartJS | null = null;
  /** 视图已初始化标志 */
  private viewInitialized = false;

  ngOnInit(): void {
    this.fetchTasks();
  }

  /** 获取任务数据 */
  fetchTasks(): void {
    this.apiService.getTaskList().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
        // 数据加载完成后渲染图表
        if (this.viewInitialized && data.length > 0) {
          setTimeout(() => this.renderChart());
        }
      },
      error: (err) => {
        console.error('获取统计数据失败:', err);
        this.loading = false;
      }
    });
  }

  /** 切换图表类型 */
  onSetChartType(type: EChartType): void {
    this.chartType = type;
    this.renderChart();
  }

  /** 渲染图表 */
  renderChart(): void {
    if (!this.chartCanvas) return;

    // 销毁旧图表
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    switch (this.chartType) {
      case 'completion':
        this.renderCompletionChart(ctx);
        break;
      case 'trend':
        this.renderTrendChart(ctx);
        break;
      case 'distribution':
        this.renderDistributionChart(ctx);
        break;
    }
  }

  /** 渲染完成率图表 */
  private renderCompletionChart(ctx: CanvasRenderingContext2D): void {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.status === 'COMPLETED').length;
    const overall = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 按优先级统计
    const byPriority: Record<EApiTaskPriority, { total: number; completed: number; rate: number }> = {
      HIGH: { total: 0, completed: 0, rate: 0 },
      MEDIUM: { total: 0, completed: 0, rate: 0 },
      LOW: { total: 0, completed: 0, rate: 0 }
    };

    this.tasks.forEach(task => {
      byPriority[task.priority].total++;
      if (task.status === 'COMPLETED') {
        byPriority[task.priority].completed++;
      }
    });

    Object.keys(byPriority).forEach(key => {
      const p = byPriority[key as EApiTaskPriority];
      p.rate = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
    });

    this.chartInstance = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['总体', '高优先级', '中优先级', '低优先级'],
        datasets: [{
          label: '完成率 (%)',
          data: [
            overall,
            byPriority.HIGH.rate,
            byPriority.MEDIUM.rate,
            byPriority.LOW.rate
          ],
          backgroundColor: [
            CHART_COLORS.blue,
            CHART_COLORS.red,
            CHART_COLORS.amber,
            CHART_COLORS.green
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  /** 渲染趋势图 */
  private renderTrendChart(ctx: CanvasRenderingContext2D): void {
    const days: string[] = [];
    const created: number[] = [];
    const completed: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push(`${date.getMonth() + 1}/${date.getDate()}`);

      const createdCount = this.tasks.filter(t => t.createdAt.startsWith(dateStr)).length;
      const completedCount = this.tasks.filter(t =>
        t.completedAt && t.completedAt.startsWith(dateStr)
      ).length;

      created.push(createdCount);
      completed.push(completedCount);
    }

    this.chartInstance = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: '新增任务',
            data: created,
            borderColor: CHART_COLORS.blue,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.3
          },
          {
            label: '完成任务',
            data: completed,
            borderColor: CHART_COLORS.green,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  /** 渲染状态分布图 */
  private renderDistributionChart(ctx: CanvasRenderingContext2D): void {
    const completed = this.tasks.filter(t => t.status === 'COMPLETED').length;
    const pending = this.tasks.filter(t => t.status === 'PENDING').length;

    this.chartInstance = new ChartJS(ctx, {
      type: 'pie',
      data: {
        labels: ['已完成', '未完成'],
        datasets: [{
          data: [completed, pending],
          backgroundColor: [CHART_COLORS.green, CHART_COLORS.gray],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });
  }

  /** 获取统计概览数据 */
  getOverviewData() {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'COMPLETED').length,
      pending: this.tasks.filter(t => t.status === 'PENDING').length
    };
  }

  /** 返回上一页 */
  onBack(): void {
    this.router.navigate(['']);
  }

  /** ngAfterViewInit 生命周期 */
  ngAfterViewInit(): void {
    this.viewInitialized = true;
    // 如果已有数据，渲染图表
    if (this.tasks.length > 0) {
      setTimeout(() => this.renderChart());
    }
  }
}
