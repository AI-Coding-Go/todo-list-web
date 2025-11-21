/**
 * 任务管理自定义Hook
 */

import { useState, useEffect, useCallback } from 'react';
import type { ITask, FilterType, SortType } from '../types';
import { storageService } from '../services/storage';
import { filterTasks, sortTasks } from '../utils';

/**
 * 任务管理Hook
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [loading, setLoading] = useState(true);

  // 加载任务数据
  const loadTasks = useCallback(() => {
    setLoading(true);
    try {
      const storedTasks = storageService.getTasks();
      setTasks(storedTasks);
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取筛选和排序后的任务
  const getFilteredAndSortedTasks = useCallback(() => {
    const filtered = filterTasks(tasks, filter);
    const sorted = sortTasks(filtered, sortType);
    return sorted;
  }, [tasks, filter, sortType]);

  // 添加任务
  const addTask = useCallback((task: Omit<ITask, 'id' | 'createdAt'>) => {
    const newTask: ITask = {
      ...task,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
    };
    
    storageService.addTask(newTask);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  // 更新任务
  const updateTask = useCallback((taskId: string, updates: Partial<ITask>) => {
    const success = storageService.updateTask(taskId, updates);
    if (success) {
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, ...updates }
            : task
        )
      );
    }
    return success;
  }, []);

  // 删除任务
  const deleteTask = useCallback((taskId: string) => {
    const success = storageService.deleteTask(taskId);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
    return success;
  }, []);

  // 切换任务状态
  const toggleTaskStatus = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updates: Partial<ITask> = {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    };

    return updateTask(taskId, updates);
  }, [tasks, updateTask]);

  // 批量更新任务
  const batchUpdateTasks = useCallback((updates: Array<{ taskId: string; updates: Partial<ITask> }>) => {
    const updatedTasks = [...tasks];
    
    updates.forEach(({ taskId, updates: taskUpdates }) => {
      const index = updatedTasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        updatedTasks[index] = { ...updatedTasks[index], ...taskUpdates };
      }
    });

    storageService.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  }, [tasks]);

  // 获取统计信息
  const getStatistics = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = total - completed;
    const overdue = tasks.filter(task => 
      task.status === 'pending' && 
      task.deadline && 
      new Date(task.deadline) < new Date()
    ).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const priorityStats = {
      high: {
        total: tasks.filter(task => task.priority === 'high').length,
        completed: tasks.filter(task => task.priority === 'high' && task.status === 'completed').length,
      },
      medium: {
        total: tasks.filter(task => task.priority === 'medium').length,
        completed: tasks.filter(task => task.priority === 'medium' && task.status === 'completed').length,
      },
      low: {
        total: tasks.filter(task => task.priority === 'low').length,
        completed: tasks.filter(task => task.priority === 'low' && task.status === 'completed').length,
      },
    };

    return {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue,
      completionRate,
      priorityStats,
    };
  }, [tasks]);

  // 初始化加载
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    filteredAndSortedTasks: getFilteredAndSortedTasks(),
    filter,
    sortType,
    loading,
    setFilter,
    setSortType,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    batchUpdateTasks,
    getStatistics,
  };
};