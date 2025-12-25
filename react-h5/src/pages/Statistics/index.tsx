/**
 * 数据统计页
 * 使用 Chart.js 展示任务完成率、趋势图和状态分布
 */

import { useState, useMemo, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import EmptyState from '@/components/EmptyState'
import api from '@/services/api'
import type { ITodoTaskResponse, ETaskPriority } from '@/types/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// 图表类型
type EChartType = 'completion' | 'trend' | 'distribution'

// 图表配置
const CHART_COLORS = {
  blue: 'rgb(59, 130, 246)',
  blueLight: 'rgba(59, 130, 246, 0.2)',
  green: 'rgb(34, 197, 94)',
  greenLight: 'rgba(34, 197, 94, 0.2)',
  amber: 'rgb(245, 158, 11)',
  red: 'rgb(239, 68, 68)',
  gray: 'rgb(156, 163, 175)',
}

const TAB_OPTIONS = [
  { value: 'completion' as const, label: '完成率' },
  { value: 'trend' as const, label: '趋势图' },
  { value: 'distribution' as const, label: '状态分布' },
]

export default function Statistics() {
  const [chartType, setChartType] = useState<EChartType>('completion')
  const [tasks, setTasks] = useState<ITodoTaskResponse[]>([])
  const [loading, setLoading] = useState(true)

  // 获取任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const data = await api.getTaskList()
        setTasks(data)
      } catch (err) {
        console.error('获取统计数据失败:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // 计算完成率数据
  const completionData = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length
    const overall = total > 0 ? Math.round((completed / total) * 100) : 0

    // 按优先级统计
    const byPriority: Record<ETaskPriority, { total: number; completed: number; rate: number }> = {
      HIGH: { total: 0, completed: 0, rate: 0 },
      MEDIUM: { total: 0, completed: 0, rate: 0 },
      LOW: { total: 0, completed: 0, rate: 0 },
    }

    tasks.forEach((task) => {
      byPriority[task.priority].total++
      if (task.status === 'COMPLETED') {
        byPriority[task.priority].completed++
      }
    })

    Object.keys(byPriority).forEach((key) => {
      const p = byPriority[key as ETaskPriority]
      p.rate = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0
    })

    return { overall, byPriority }
  }, [tasks])

  // 计算趋势数据（近 7 天）
  const trendData = useMemo(() => {
    const days: string[] = []
    const created: number[] = []
    const completed: number[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      days.push(`${date.getMonth() + 1}/${date.getDate()}`)

      // 统计当天创建和完成的任务
      const createdCount = tasks.filter((t) =>
        t.createdAt.startsWith(dateStr)
      ).length
      const completedCount = tasks.filter((t) =>
        t.completedAt && t.completedAt.startsWith(dateStr)
      ).length

      created.push(createdCount)
      completed.push(completedCount)
    }

    return { days, created, completed }
  }, [tasks])

  // 计算状态分布数据
  const distributionData = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length
    const pending = tasks.filter((t) => t.status === 'PENDING').length
    return { completed, pending }
  }, [tasks])

  // 完成率图表数据
  const completionChartData = useMemo(() => ({
    labels: ['总体', '高优先级', '中优先级', '低优先级'],
    datasets: [{
      label: '完成率 (%)',
      data: [
        completionData.overall,
        completionData.byPriority.HIGH.rate,
        completionData.byPriority.MEDIUM.rate,
        completionData.byPriority.LOW.rate,
      ],
      backgroundColor: [
        CHART_COLORS.blue,
        CHART_COLORS.red,
        CHART_COLORS.amber,
        CHART_COLORS.green,
      ],
      borderRadius: 8,
    }],
  }), [completionData])

  // 趋势图数据
  const trendChartData = useMemo(() => ({
    labels: trendData.days,
    datasets: [
      {
        label: '新增任务',
        data: trendData.created,
        borderColor: CHART_COLORS.blue,
        backgroundColor: CHART_COLORS.blueLight,
        fill: true,
        tension: 0.3,
      },
      {
        label: '完成任务',
        data: trendData.completed,
        borderColor: CHART_COLORS.green,
        backgroundColor: CHART_COLORS.greenLight,
        fill: true,
        tension: 0.3,
      },
    ],
  }), [trendData])

  // 状态分布图数据
  const distributionChartData = useMemo(() => ({
    labels: ['已完成', '未完成'],
    datasets: [{
      data: [distributionData.completed, distributionData.pending],
      backgroundColor: [CHART_COLORS.green, CHART_COLORS.gray],
      borderWidth: 0,
    }],
  }), [distributionData])

  // 图表通用配置
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }), [chartType])

  // 饼图配置
  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
    },
  }), [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">加载中...</span>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <TopBar title="数据统计" showBack onBack={() => window.history.back()} />
        <main className="pt-14">
          <EmptyState type="statistics" text="暂无统计数据，添加任务后即可查看" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      {/* 顶部导航栏 */}
      <TopBar title="数据统计" showBack onBack={() => window.history.back()} />

      {/* 主内容区 */}
      <main className="pt-14 px-4">
        {/* Tab 切换 */}
        <div className="flex bg-white rounded-lg p-1 mb-4 shadow-sm">
          {TAB_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setChartType(option.value)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                chartType === option.value
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-500">{tasks.length}</div>
            <div className="text-xs text-gray-500 mt-1">总任务</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-500">{distributionData.completed}</div>
            <div className="text-xs text-gray-500 mt-1">已完成</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <div className="text-2xl font-bold text-amber-500">{distributionData.pending}</div>
            <div className="text-xs text-gray-500 mt-1">未完成</div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            {TAB_OPTIONS.find((t) => t.value === chartType)?.label}
          </h3>

          <div className="h-64">
            {chartType === 'completion' && (
              <Bar data={completionChartData} options={chartOptions} />
            )}
            {chartType === 'trend' && (
              <Line data={trendChartData} options={chartOptions} />
            )}
            {chartType === 'distribution' && (
              <Pie data={distributionChartData} options={pieOptions} />
            )}
          </div>
        </div>

        {/* 近 7 天完成率说明 */}
        {chartType === 'completion' && (
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">统计说明</h3>
            <p className="text-xs text-gray-500">
              展示所有任务的总体完成率以及按优先级分类的完成率。
              完成率 = 已完成任务数 / 总任务数 × 100%
            </p>
          </div>
        )}

        {/* 趋势图说明 */}
        {chartType === 'trend' && (
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">统计说明</h3>
            <p className="text-xs text-gray-500">
              展示近 7 天每日新增任务数和完成任务数的趋势变化。
              蓝色区域表示新增任务，绿色区域表示完成任务。
            </p>
          </div>
        )}

        {/* 状态分布说明 */}
        {chartType === 'distribution' && (
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">统计说明</h3>
            <p className="text-xs text-gray-500">
              展示当前所有任务中已完成和未完成的数量占比。
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
