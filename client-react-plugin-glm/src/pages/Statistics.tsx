/**
 * 数据统计页面
 */
import React, { useState, useMemo } from 'react'
import Header from '@/components/Common/Header'
import EmptyState from '@/components/Common/EmptyState'
import { useTodoStore } from '@/store/todoStore'
import { formatDate, getRecent7Days } from '@/utils/date'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import clsx from 'classnames'

// 注册Chart.js组件
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

type TabType = 'completion-rate' | 'trend' | 'distribution'

const Statistics: React.FC = () => {
  const { todos } = useTodoStore()
  const [activeTab, setActiveTab] = useState<TabType>('completion-rate')
  
  // 获取近7天日期
  const recent7Days = useMemo(() => getRecent7Days(), [])
  
  // 计算统计数据
  const statistics = useMemo(() => {
    // 基础统计
    const total = todos.length
    const completed = todos.filter(todo => todo.status === 'completed').length
    const pending = total - completed
    
    // 计算逾期任务
    const now = new Date()
    const overdue = todos.filter(todo => 
      todo.status === 'pending' && 
      todo.dueDate && 
      new Date(todo.dueDate) < now
    ).length
    
    // 计算完成率
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    // 按优先级统计
    const byPriority = {
      high: {
        total: todos.filter(todo => todo.priority === 'high').length,
        completed: todos.filter(todo => todo.priority === 'high' && todo.status === 'completed').length,
      },
      medium: {
        total: todos.filter(todo => todo.priority === 'medium').length,
        completed: todos.filter(todo => todo.priority === 'medium' && todo.status === 'completed').length,
      },
      low: {
        total: todos.filter(todo => todo.priority === 'low').length,
        completed: todos.filter(todo => todo.priority === 'low' && todo.status === 'completed').length,
      },
    }
    
    // 每日趋势数据
    const dailyTrend = recent7Days.map(day => {
      const dayDate = day.date
      const created = todos.filter(todo => formatDate(todo.createdAt) === dayDate).length
      const completed = todos.filter(todo => 
        todo.completedAt && formatDate(todo.completedAt) === dayDate
      ).length
      
      return {
        date: dayDate,
        label: day.label,
        created,
        completed,
      }
    })
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      byPriority,
      dailyTrend,
    }
  }, [todos, recent7Days])
  
  // 选项卡数据
  const tabs = [
    { key: 'completion-rate' as TabType, label: '完成率' },
    { key: 'trend' as TabType, label: '趋势图' },
    { key: 'distribution' as TabType, label: '状态分布' },
  ]
  
  // 完成率图表数据
  const completionRateChartData = {
    labels: ['高优先级', '中优先级', '低优先级', '总体'],
    datasets: [
      {
        label: '完成率 (%)',
        data: [
          statistics.byPriority.high.total > 0 
            ? Math.round((statistics.byPriority.high.completed / statistics.byPriority.high.total) * 100) 
            : 0,
          statistics.byPriority.medium.total > 0 
            ? Math.round((statistics.byPriority.medium.completed / statistics.byPriority.medium.total) * 100) 
            : 0,
          statistics.byPriority.low.total > 0 
            ? Math.round((statistics.byPriority.low.completed / statistics.byPriority.low.total) * 100) 
            : 0,
          statistics.completionRate,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 1,
      },
    ],
  }
  
  // 趋势图表数据
  const trendChartData = {
    labels: statistics.dailyTrend.map(item => item.label),
    datasets: [
      {
        label: '新增任务',
        data: statistics.dailyTrend.map(item => item.created),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '完成任务',
        data: statistics.dailyTrend.map(item => item.completed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
  
  // 状态分布图表数据
  const distributionChartData = {
    labels: ['未完成', '已完成', '已逾期'],
    datasets: [
      {
        data: [statistics.pending, statistics.completed, statistics.overdue],
        backgroundColor: [
          'rgba(245, 158, 11, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  }
  
  // 图表选项
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: activeTab !== 'distribution' ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: activeTab === 'completion-rate' ? 20 : 1,
        },
      },
    } : undefined,
  }
  
  // 没有数据时的提示
  if (statistics.total === 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <Header title="数据统计" />
        <EmptyState
          icon="fas fa-chart-pie"
          title="暂无统计数据"
          description="添加任务后即可查看"
        />
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header title="数据统计" />
      
      {/* 选项卡 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={clsx(
                'flex-1 py-3 text-sm font-medium',
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500'
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 图表区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 完成率选项卡 */}
        {activeTab === 'completion-rate' && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-base font-medium mb-4">近7天任务完成率</h3>
            <div className="h-64">
              <Bar data={completionRateChartData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">{statistics.completionRate}%</div>
                <div className="text-xs text-gray-500 mt-1">总体完成率</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-500">{statistics.completed}</div>
                <div className="text-xs text-gray-500 mt-1">已完成任务</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 趋势图选项卡 */}
        {activeTab === 'trend' && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-base font-medium mb-4">近7天任务趋势</h3>
            <div className="h-64">
              <Line data={trendChartData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {statistics.dailyTrend.reduce((sum, item) => sum + item.created, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">近7天新增</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {statistics.dailyTrend.reduce((sum, item) => sum + item.completed, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">近7天完成</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 状态分布选项卡 */}
        {activeTab === 'distribution' && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-base font-medium mb-4">任务状态分布</h3>
            <div className="h-64">
              <Pie data={distributionChartData} options={chartOptions} />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">未完成</span>
                </div>
                <span className="text-sm font-medium">{statistics.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">已完成</span>
                </div>
                <span className="text-sm font-medium">{statistics.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">已逾期</span>
                </div>
                <span className="text-sm font-medium">{statistics.overdue}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistics