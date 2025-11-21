/**
 * 数据统计页面
 */

import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartBar } from '@fortawesome/free-solid-svg-icons';
import type { IStatistics } from '../types';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useTasks } from '../hooks/useTasks';
import dayjs from '../utils/dayjs';

// 注册 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface IStatisticsPageProps {
  onNavigate: (path: string) => void;
  onBack: () => void;
}

type ChartTab = 'completion' | 'trend' | 'distribution';

/**
 * 数据统计页面组件
 */
export const StatisticsPage: React.FC<IStatisticsPageProps> = ({
  onNavigate,
  onBack,
}) => {
  const { tasks, getStatistics } = useTasks();
  const [activeTab, setActiveTab] = useState<ChartTab>('completion');
  const [loading, setLoading] = useState(false);

  // 获取统计数据
  const statistics: IStatistics = getStatistics();

  // 生成近7天日期标签
  const generateDateLabels = () => {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      labels.push(dayjs().subtract(i, 'day').format('MM-DD'));
    }
    return labels;
  };

  // 生成趋势数据
  const generateTrendData = () => {
    const labels = generateDateLabels();
    const addedData = [];
    const completedData = [];

    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      
      const addedCount = tasks.filter(task => 
        dayjs(task.createdAt).format('YYYY-MM-DD') === dateStr
      ).length;
      
      const completedCount = tasks.filter(task => 
        task.completedAt && dayjs(task.completedAt).format('YYYY-MM-DD') === dateStr
      ).length;

      addedData.push(addedCount);
      completedData.push(completedCount);
    }

    return { labels, addedData, completedData };
  };

  const trendData = generateTrendData();

  // 图表配置
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const lineChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: '新增任务',
        data: trendData.addedData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
      },
      {
        label: '完成任务',
        data: trendData.completedData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const pieChartData = {
    labels: ['未完成', '已完成'],
    datasets: [
      {
        data: [statistics.pendingTasks, statistics.completedTasks],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgb(251, 146, 60)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // 渲染完成率统计
  const renderCompletionStats = () => (
    <div className="space-y-6">
      {/* 总体完成率 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">总体完成率</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-primary-600">
              {statistics.completionRate}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {statistics.completedTasks} / {statistics.totalTasks} 个任务
            </div>
          </div>
          <div className="w-24 h-24">
            <div className="relative w-full h-full">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - statistics.completionRate / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-900">
                  {statistics.completionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 优先级完成率 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">按优先级统计</h3>
        <div className="space-y-4">
          {Object.entries(statistics.priorityStats).map(([priority, stats]) => {
            const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            const priorityLabels = { high: '高', medium: '中', low: '低' };
            const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
            
            return (
              <div key={priority}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {priorityLabels[priority as keyof typeof priorityLabels]}优先级
                  </span>
                  <span className="text-sm text-gray-500">
                    {stats.completed} / {stats.total} ({rate}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${rate}%`,
                      backgroundColor: priorityColors[priority as keyof typeof priorityColors],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 渲染趋势图
  const renderTrendChart = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">近7天任务趋势</h3>
      <div className="h-64">
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );

  // 渲染状态分布
  const renderDistribution = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">任务状态分布</h3>
      <div className="h-64">
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );

  // 如果没有任务数据
  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="数据统计"
          showBackButton={true}
          onBack={onBack}
        />
        <main className="pt-14 px-4">
          <EmptyState
            icon={faChartBar}
            title="暂无统计数据"
            description="添加任务后即可查看统计信息"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <Header
        title="数据统计"
        showBackButton={true}
        onBack={onBack}
      />

      {/* 主内容区 */}
      <main className="pt-14 pb-8 px-4">
        {/* Tab 切换 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('completion')}
              className={`
                flex-1 py-3 text-sm font-medium transition-colors
                ${activeTab === 'completion'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              完成率
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              className={`
                flex-1 py-3 text-sm font-medium transition-colors
                ${activeTab === 'trend'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              趋势图
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`
                flex-1 py-3 text-sm font-medium transition-colors
                ${activeTab === 'distribution'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              状态分布
            </button>
          </div>
        </div>

        {/* 图表内容 */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {activeTab === 'completion' && renderCompletionStats()}
              {activeTab === 'trend' && renderTrendChart()}
              {activeTab === 'distribution' && renderDistribution()}
            </>
          )}
        </div>
      </main>
    </div>
  );
};