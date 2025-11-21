/**
 * 主布局组件
 */
import React from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import clsx from 'classnames'
import ReminderBanner from '@/components/Reminder/ReminderBanner'

const MainLayout: React.FC = () => {
  const location = useLocation()
  
  // 判断当前路径是否为首页
  const isHomePage = location.pathname === '/'
  
  return (
    <div className="flex flex-col h-screen">
      {/* 提醒横幅 */}
      <ReminderBanner />
      
      {/* 主内容区域 */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      
      {/* 底部导航栏 */}
      <nav className="h-14 bg-white border-t border-gray-200 safe-area-bottom">
        <ul className="flex items-center justify-around h-full">
          <li>
            <Link
              to="/"
              className={clsx(
                'flex flex-col items-center justify-center h-full w-full text-xs',
                location.pathname === '/' ? 'text-primary' : 'text-gray-500'
              )}
            >
              <i className="fas fa-list-check text-lg mb-1"></i>
              <span>待办</span>
            </Link>
          </li>
          <li>
            <Link
              to="/statistics"
              className={clsx(
                'flex flex-col items-center justify-center h-full w-full text-xs',
                location.pathname === '/statistics' ? 'text-primary' : 'text-gray-500'
              )}
            >
              <i className="fas fa-chart-pie text-lg mb-1"></i>
              <span>统计</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={clsx(
                'flex flex-col items-center justify-center h-full w-full text-xs',
                location.pathname === '/settings' ? 'text-primary' : 'text-gray-500'
              )}
            >
              <i className="fas fa-cog text-lg mb-1"></i>
              <span>设置</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default MainLayout