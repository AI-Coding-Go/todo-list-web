/**
 * 任务详情页面
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';
import type { ITask } from '../types';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/task/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { getPriorityColor, getPriorityLabel, formatDateTime, isOverdue } from '../utils';

interface ITaskDetailPageProps {
  taskId: string;
  onNavigate: (path: string) => void;
  onBack: () => void;
}

/**
 * 任务详情页面组件
 */
export const TaskDetailPage: React.FC<ITaskDetailPageProps> = ({
  taskId,
  onNavigate,
  onBack,
}) => {
  const { tasks, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const [task, setTask] = useState<ITask | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 查找任务
  useEffect(() => {
    const foundTask = tasks.find(t => t.id === taskId);
    setTask(foundTask || null);
  }, [taskId, tasks]);

  // 如果任务不存在，显示错误页面
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="任务详情"
          showBackButton={true}
          onBack={onBack}
        />
        <main className="pt-14 px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">任务不存在</p>
            <Button
              variant="primary"
              onClick={onBack}
              className="mt-4"
            >
              返回
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 处理编辑任务
  const handleEditTask = async (taskData: Omit<ITask, 'id' | 'createdAt'>) => {
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟异步操作
      updateTask(task.id, taskData);
      setShowEditModal(false);
    } catch (error) {
      console.error('更新任务失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 处理删除任务
  const handleDeleteTask = async () => {
    const confirmed = window.confirm('确定删除该任务？删除后不可恢复');
    if (confirmed) {
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟异步操作
      deleteTask(task.id);
      onBack();
    }
  };

  // 处理任务状态切换
  const handleToggleStatus = async () => {
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // 模拟异步操作
      toggleTaskStatus(task.id);
    } catch (error) {
      console.error('切换任务状态失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isTaskOverdue = isOverdue(task);
  const isCompleted = task.status === 'completed';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <Header
        title="任务详情"
        showBackButton={true}
        onBack={onBack}
      />

      {/* 主内容区 */}
      <main className="pt-14 pb-8 px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* 任务标题和优先级 */}
          <div className="flex items-start space-x-3 mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className="inline-block px-3 py-1 text-sm font-medium text-white rounded"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {getPriorityLabel(task.priority)}
                </span>
                <span className={`
                  px-3 py-1 text-sm font-medium rounded
                  ${isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }
                `}>
                  {isCompleted ? '已完成' : '未完成'}
                </span>
              </div>
              
              <h1 className={`
                text-xl font-bold text-gray-900 break-words
                ${isCompleted ? 'line-through opacity-60' : ''}
              `}>
                {task.title}
              </h1>
            </div>
          </div>

          {/* 任务信息 */}
          <div className="space-y-4 mb-6">
            {/* 截止时间 */}
            {task.deadline && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">截止时间：</span>
                <span className={`
                  text-sm
                  ${isTaskOverdue && !isCompleted ? 'text-red-600 font-medium' : 'text-gray-900'}
                `}>
                  {formatDateTime(task.deadline, 'YYYY年MM月DD日 HH:mm')}
                  {isTaskOverdue && !isCompleted && ' (已逾期)'}
                </span>
              </div>
            )}

            {/* 创建时间 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">创建时间：</span>
              <span className="text-sm text-gray-900">
                {formatDateTime(task.createdAt, 'YYYY年MM月DD日 HH:mm')}
              </span>
            </div>

            {/* 完成时间 */}
            {task.completedAt && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">完成时间：</span>
                <span className="text-sm text-gray-900">
                  {formatDateTime(task.completedAt, 'YYYY年MM月DD日 HH:mm')}
                </span>
              </div>
            )}

            {/* 任务描述 */}
            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">任务描述</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                    {task.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col space-y-3">
            {/* 状态切换按钮 */}
            <Button
              variant={isCompleted ? 'secondary' : 'primary'}
              icon={isCompleted ? faUndo : faCheck}
              onClick={handleToggleStatus}
              loading={submitting}
              className="w-full"
            >
              {isCompleted ? '标记为未完成' : '标记为已完成'}
            </Button>

            {/* 编辑和删除按钮 */}
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                icon={faEdit}
                onClick={() => setShowEditModal(true)}
                disabled={submitting}
                className="flex-1"
              >
                编辑
              </Button>
              <Button
                variant="danger"
                icon={faTrash}
                onClick={handleDeleteTask}
                disabled={submitting}
                className="flex-1"
              >
                删除
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* 编辑任务模态框 */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑任务"
        size="md"
      >
        <TaskForm
          task={task}
          onSubmit={handleEditTask}
          onCancel={() => setShowEditModal(false)}
          loading={submitting}
        />
      </Modal>
    </div>
  );
};