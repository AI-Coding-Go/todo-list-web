/**
 * 任务列表页面
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faListCheck } from '@fortawesome/free-solid-svg-icons';
import type { ITask, FilterType, SortType } from '../types';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { FloatingButton } from '../components/layout/FloatingButton';
import { TaskFilter } from '../components/task/TaskFilter';
import { TaskItem } from '../components/task/TaskItem';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/task/TaskForm';
import { useTasks } from '../hooks/useTasks';

interface ITaskListPageProps {
  onNavigate: (path: string) => void;
}

/**
 * 任务列表页面组件
 */
export const TaskListPage: React.FC<ITaskListPageProps> = ({
  onNavigate,
}) => {
  const {
    tasks,
    filteredAndSortedTasks,
    filter,
    sortType,
    loading,
    setFilter,
    setSortType,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 处理添加任务
  const handleAddTask = async (taskData: Omit<ITask, 'id' | 'createdAt'>) => {
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟异步操作
      addTask(taskData);
      setShowAddModal(false);
    } catch (error) {
      console.error('添加任务失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 处理编辑任务
  const handleEditTask = async (taskData: Omit<ITask, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟异步操作
      updateTask(editingTask.id, taskData);
      setShowEditModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('更新任务失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 处理删除任务
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  // 处理任务状态切换
  const handleToggleTaskStatus = (taskId: string) => {
    toggleTaskStatus(taskId);
  };

  // 处理查看任务详情
  const handleViewTask = (task: ITask) => {
    onNavigate(`/task/${task.id}`);
  };

  // 处理编辑按钮点击
  const handleEditClick = (task: ITask) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  // 处理筛选变化
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  // 处理排序变化
  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <Header title="待办清单" />

      {/* 主内容区 */}
      <main className="pt-14 pb-20 px-4">
        {/* 筛选组件 */}
        <TaskFilter
          filter={filter}
          sortType={sortType}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        {/* 任务列表 */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <EmptyState
              icon={faListCheck}
              title={tasks.length === 0 ? '暂无任务' : '没有符合条件的任务'}
              description={tasks.length === 0 ? '点击右下角按钮添加第一个任务' : undefined}
              action={tasks.length === 0 ? {
                label: '添加任务',
                onClick: () => setShowAddModal(true),
              } : undefined}
            />
          ) : (
            filteredAndSortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={handleToggleTaskStatus}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
                onView={handleViewTask}
              />
            ))
          )}
        </div>
      </main>

      {/* 悬浮添加按钮 */}
      {tasks.length > 0 && (
        <FloatingButton
          onClick={() => setShowAddModal(true)}
          icon={faPlus}
        />
      )}

      {/* 底部导航 */}
      <BottomNav
        currentPath="/"
        onNavigate={onNavigate}
      />

      {/* 添加任务模态框 */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="新增任务"
        size="md"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowAddModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* 编辑任务模态框 */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑任务"
        size="md"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleEditTask}
            onCancel={() => {
              setShowEditModal(false);
              setEditingTask(null);
            }}
            loading={submitting}
          />
        )}
      </Modal>
    </div>
  );
};