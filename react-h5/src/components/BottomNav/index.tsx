/**
 * 底部导航栏组件
 * 固定在底部，包含待办、统计、设置三个导航项
 */

import { NavLink } from 'react-router-dom'
import React from 'react'

interface INavItem {
  path: string
  label: string
  icon: string
}

interface IBottomNavProps {
  /** 导航项配置 */
  items: INavItem[]
}

// 图标 SVG 组件
const Icons: Record<string, React.ReactElement> = {
  list: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  chart: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  cog: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
}

export default function BottomNav({ items }: IBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-white border-t border-gray-200 flex items-center justify-around">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-full h-full
            ${isActive ? 'text-blue-500' : 'text-gray-400'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className={isActive ? 'text-blue-500' : 'text-gray-400'}>
                {Icons[item.icon]}
              </div>
              <span className="text-xs mt-0.5">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
