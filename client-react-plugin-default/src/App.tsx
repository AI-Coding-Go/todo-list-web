/**
 * 应用主组件
 */

import React, { useState, useEffect } from 'react';
import { TaskListPage } from './pages/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TestPage } from './pages/TestPage';
import { ReminderBar } from './components/reminder/ReminderBar';
import { useTasks } from './hooks/useTasks';
import { useReminder } from './hooks/useReminder';

/**
 * 路由类型
 */
type Route = {
  path: string;
  component: React.ComponentType<any>;
  props?: any;
};

/**
 * 应用主组件
 */
export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { tasks } = useTasks();
  const { activeReminder, clearReminder, snoozeReminder, viewTask } = useReminder(tasks);

  // 处理导航
  const handleNavigate = (path: string) => {
    if (path !== currentPath) {
      setIsNavigating(true);
      // 模拟页面切换动画
      setTimeout(() => {
        setCurrentPath(path);
        setIsNavigating(false);
      }, 150);
    }
  };

  // 解析路由
  const parseRoute = (): Route => {
    if (currentPath === '/') {
      return {
        path: '/',
        component: TaskListPage,
        props: { onNavigate: handleNavigate },
      };
    }

    if (currentPath === '/statistics') {
      return {
        path: '/statistics',
        component: StatisticsPage,
        props: { 
          onNavigate: handleNavigate,
          onBack: () => handleNavigate('/'),
        },
      };
    }

    if (currentPath === '/settings') {
      return {
        path: '/settings',
        component: SettingsPage,
        props: { 
          onNavigate: handleNavigate,
          onBack: () => handleNavigate('/'),
        },
      };
    }

    if (currentPath === '/test') {
      return {
        path: '/test',
        component: TestPage,
        props: {
          onNavigate: handleNavigate,
          onBack: () => handleNavigate('/'),
        },
      };
    }

    // 任务详情页
    const taskDetailMatch = currentPath.match(/^\/task\/([^\/]+)$/);
    if (taskDetailMatch) {
      const taskId = taskDetailMatch[1];
      return {
        path: `/task/${taskId}`,
        component: TaskDetailPage,
        props: { 
          taskId,
          onNavigate: handleNavigate,
          onBack: () => handleNavigate('/'),
        },
      };
    }

    // 404 页面，返回首页
    return {
      path: '/',
      component: TaskListPage,
      props: { onNavigate: handleNavigate },
    };
  };

  // 处理浏览器前进后退
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.hash.slice(1) || '/';
      setCurrentPath(path);
    };

    // 监听浏览器历史变化
    window.addEventListener('popstate', handlePopState);

    // 初始化当前路径
    const initialPath = window.location.hash.slice(1) || '/';
    setCurrentPath(initialPath);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 更新浏览器历史
  useEffect(() => {
    if (currentPath !== window.location.hash.slice(1)) {
      window.history.pushState(null, '', `#${currentPath}`);
    }
  }, [currentPath]);

  const route = parseRoute();
  const CurrentComponent = route.component;

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 页面切换动画 */}
      <div className={`
        transition-opacity duration-150
        ${isNavigating ? 'opacity-0' : 'opacity-100'}
      `}>
        <CurrentComponent {...route.props} />
      </div>

      {/* 提醒条 */}
      {activeReminder && (
        <ReminderBar
          reminder={activeReminder}
          onView={viewTask}
          onSnooze={snoozeReminder}
          onDismiss={clearReminder}
        />
      )}
    </div>
  );
};

export default App;