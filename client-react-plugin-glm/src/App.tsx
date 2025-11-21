/**
 * 应用程序根组件
 */
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/Layout/MainLayout'
import TodoList from '@/pages/TodoList'
import TodoDetail from '@/pages/TodoDetail'
import TodoForm from '@/pages/TodoForm'
import Statistics from '@/pages/Statistics'
import Settings from '@/pages/Settings'

function App() {
  return (
    <div className="mobile-container">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<TodoList />} />
          <Route path="todo/:id" element={<TodoDetail />} />
          <Route path="todo/new" element={<TodoForm />} />
          <Route path="todo/:id/edit" element={<TodoForm />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App