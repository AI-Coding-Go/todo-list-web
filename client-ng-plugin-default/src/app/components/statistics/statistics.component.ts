/**
 * 统计组件
 * 负责显示任务统计数据和图表
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { ITask, TaskUtils } from '../../models/task.model';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';

/**
 * 统计类型
 */
type StatTab = 'completion' | 'trend' | 'distribution';

/**
 * 统计组件
 */
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less'],
  imports: [CommonModule]
})
export class StatisticsComponent implements OnInit, OnDestroy {
  /** 组件销毁标识 */
  private destroy$ = new Subject<void>();
  
  /** 当前选中的统计标签 */
  currentTab: StatTab = 'completion';
  
  /** 任务列表 */
  tasks: ITask[] = [];
  
  /** 任务统计信息 */
  taskStats = TaskUtils.calculateStats([]);
  
  /** 周统计数据 */
  weeklyStats: { date: string; created: number; completed: number }[] = [];
  
  /** 图表实例 */
  charts: { [key: string]: Chart } = {};

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.initSubscriptions();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }

  /**
   * 初始化订阅
   */
  private initSubscriptions(): void {
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadData();
      });
  }

  /**
   * 加载数据
   */
  private loadData(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.taskStats = TaskUtils.calculateStats(this.tasks);
      this.weeklyStats = this.taskService.getWeeklyStats();
    });
    
    // 延迟渲染图表，确保DOM已更新
    setTimeout(() => {
      this.renderCurrentChart();
    }, 100);
  }

  /**
   * 切换统计标签
   */
  switchTab(tab: StatTab): void {
    this.currentTab = tab;
    this.renderCurrentChart();
  }

  /**
   * 渲染当前图表
   */
  private renderCurrentChart(): void {
    // 销毁现有图表
    this.destroyCharts();
    
    switch (this.currentTab) {
      case 'completion':
        this.renderCompletionChart();
        break;
      case 'trend':
        this.renderTrendChart();
        break;
      case 'distribution':
        this.renderDistributionChart();
        break;
    }
  }

  /**
   * 渲染完成率图表
   */
  private renderCompletionChart(): void {
    const canvas = document.getElementById('completionChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = this.taskStats.total;
    const completed = this.taskStats.completed;
    const pending = this.taskStats.pending;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['已完成', '未完成'],
        datasets: [{
          data: [completed, pending],
          backgroundColor: ['#34c759', '#ff9500'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.charts['completion'] = new Chart(ctx, config);
  }

  /**
   * 渲染趋势图表
   */
  private renderTrendChart(): void {
    const canvas = document.getElementById('trendChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = this.weeklyStats.map(stat => {
      const date = new Date(stat.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const createdData = this.weeklyStats.map(stat => stat.created);
    const completedData = this.weeklyStats.map(stat => stat.completed);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '新增任务',
            data: createdData,
            borderColor: '#007aff',
            backgroundColor: 'rgba(0, 122, 255, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: '完成任务',
            data: completedData,
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.charts['trend'] = new Chart(ctx, config);
  }

  /**
   * 渲染分布图表
   */
  private renderDistributionChart(): void {
    const canvas = document.getElementById('distributionChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['高优先级', '中优先级', '低优先级'],
        datasets: [{
          data: [
            this.taskStats.highPriority,
            this.taskStats.mediumPriority,
            this.taskStats.lowPriority
          ],
          backgroundColor: ['#ff3b30', '#ff9500', '#34c759'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const percentage = this.taskStats.total > 0 ? 
                  Math.round((value / this.taskStats.total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.charts['distribution'] = new Chart(ctx, config);
  }

  /**
   * 销毁所有图表
   */
  private destroyCharts(): void {
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  /**
   * 获取完成率
   */
  get completionRate(): number {
    if (this.taskStats.total === 0) return 0;
    return Math.round((this.taskStats.completed / this.taskStats.total) * 100);
  }

  /**
   * 获取优先级完成率
   */
  getPriorityCompletionRate(priority: 'high' | 'medium' | 'low'): number {
    const priorityTasks = this.tasks.filter(task => task.priority === priority);
    if (priorityTasks.length === 0) return 0;
    
    const completedTasks = priorityTasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / priorityTasks.length) * 100);
  }

  /**
   * 检查是否有数据
   */
  get hasData(): boolean {
    return this.tasks.length > 0;
  }

  /**
   * 导航到列表页
   */
  navigateToList(): void {
    // 这里需要注入Router，暂时使用window.location
    window.location.hash = '/';
  }

  /**
   * 获取空状态文本
   */
  get emptyText(): string {
    return '暂无统计数据，添加任务后即可查看';
  }
}