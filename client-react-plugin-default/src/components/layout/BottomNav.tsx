/**
 * 底部导航组件
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';

interface INavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

interface IBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

/**
 * 底部导航组件
 */
export const BottomNav: React.FC<IBottomNavProps> = ({
  currentPath,
  onNavigate,
}) => {
  // 导航项配置
  const navItems: INavItem[] = [
    {
      id: 'tasks',
      label: '待办',
      icon: faListCheck,
      path: '/',
    },
    {
      id: 'statistics',
      label: '统计',
      icon: faChartBar,
      path: '/statistics',
    },
    {
      id: 'settings',
      label: '设置',
      icon: faCog,
      path: '/settings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`
                flex flex-col items-center justify-center space-y-1 px-3 py-2
                transition-all duration-200 min-w-[44px] min-h-[44px]
                ${isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`
                  w-5 h-5
                  ${isActive ? 'text-primary-600' : 'text-gray-500'}
                `}
              />
              <span className={`
                text-xs font-medium
                ${isActive ? 'text-primary-600' : 'text-gray-500'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};