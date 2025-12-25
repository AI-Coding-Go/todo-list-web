/**
 * 应用根组件
 * 整合提醒悬浮条和路由
 */

import { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useReminder } from '@/hooks/useReminder'
import ReminderBar from '@/components/ReminderBar'

// 懒加载页面组件
const TaskList = lazy(() => import('@/pages/TaskList'))
const TaskEdit = lazy(() => import('@/pages/TaskEdit'))
const TaskDetail = lazy(() => import('@/pages/TaskDetail'))
const Statistics = lazy(() => import('@/pages/Statistics'))
const Settings = lazy(() => import('@/pages/Settings'))
const ApiTest = lazy(() => import('@/pages/ApiTest'))

function AppContent() {
  const { reminders, markAsReminded, clearReminders } = useReminder()

  return (
    <div className="app">
      {/* 提醒悬浮条 */}
      <ReminderBar
        reminders={reminders}
        onViewTask={(taskId) => {
          markAsReminded(taskId)
          window.location.hash = `/task/${taskId}`
        }}
        onLater={clearReminders}
        onClose={clearReminders}
      />

      <Suspense fallback={<div className="loading">加载中...</div>}>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/task/new" element={<TaskEdit />} />
          <Route path="/task/edit/:id" element={<TaskEdit />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test-api" element={<ApiTest />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default function Root() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}
