/**
 * API 测试页面
 * 用于测试所有后端接口功能
 */

import { useState, useCallback } from 'react';
import {
  getTaskList,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markTaskComplete,
  markTaskPending,
  getReminders,
} from '@/services/api';
import { formatDateTime } from '@/utils/date';
import type { ETaskPriority } from '@/types/api';

/** API 测试项接口 */
interface IApiTestItem {
  /** 显示名称 */
  label: string;
  /** HTTP 方法 */
  method: string;
  /** 接口路径 */
  path: string;
  /** 测试函数 */
  action: () => Promise<void>;
}

/** 测试项状态 */
type TItemState = 'success' | 'error' | null;

/** HTTP 方法对应的 Tailwind 样式 */
const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  PATCH: 'bg-purple-100 text-purple-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function ApiTestPage() {
  /** 测试任务 ID */
  const [testTaskId, setTestTaskId] = useState(1);

  /** 当前加载状态的按钮索引 */
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  /** 各测试项的状态 */
  const [itemStates, setItemStates] = useState<Record<number, TItemState>>({});

  /**
   * 更新加载状态
   */
  const updateLoadingState = useCallback((index: number, state: TItemState) => {
    setLoadingIndex(index);
    setItemStates((prev) => ({ ...prev, [index]: null }));
    if (state !== null) {
      setItemStates((prev) => ({ ...prev, [index]: state }));
      setLoadingIndex(null);
    }
  }, []);

  /**
   * 测试获取任务列表
   */
  const testGetTaskList = useCallback(async () => {
    const index = 0;
    updateLoadingState(index, null);
    console.group('📡 API 调用 - 获取任务列表');
    console.log('🔗 请求:', 'GET /api/tasks');

    try {
      const response = await getTaskList();
      console.log('✅ 成功:', response);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState]);

  /**
   * 测试获取单个任务
   */
  const testGetTaskById = useCallback(async () => {
    const index = 1;
    updateLoadingState(index, null);
    console.group('📡 API 调用 - 获取单个任务');
    console.log('🔗 请求:', `GET /api/tasks/${testTaskId}`);

    try {
      const response = await getTaskById(testTaskId);
      console.log('✅ 成功:', response);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState, testTaskId]);

  /**
   * 测试创建新任务
   */
  const testCreateTask = useCallback(async () => {
    const index = 2;
    updateLoadingState(index, null);

    const newTask = {
      title: `测试任务 ${Date.now()}`,
      description: '这是一个测试任务描述',
      priority: 'HIGH' as ETaskPriority,
      deadline: formatDateTime(Date.now() + 86400000, 'YYYY-MM-DDTHH:mm:ss'),
    };

    console.group('📡 API 调用 - 创建新任务');
    console.log('🔗 请求:', 'POST /api/tasks');
    console.log('📤 请求体:', newTask);

    try {
      const response = await createTask(newTask);
      console.log('✅ 成功:', response);
      // 更新测试任务 ID 为新创建的任务 ID
      setTestTaskId(response.id);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState]);

  /**
   * 测试更新任务
   */
  const testUpdateTask = useCallback(async () => {
    const index = 3;
    updateLoadingState(index, null);
    const updateData = {
      title: `更新后的任务标题 ${Date.now()}`,
      description: '更新后的任务描述',
    };

    console.group('📡 API 调用 - 更新任务');
    console.log('🔗 请求:', `PUT /api/tasks/${testTaskId}`);
    console.log('📤 请求体:', updateData);

    try {
      const response = await updateTask(testTaskId, updateData);
      console.log('✅ 成功:', response);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState, testTaskId]);

  /**
   * 测试删除任务
   */
  const testDeleteTask = useCallback(async () => {
    const index = 4;
    updateLoadingState(index, null);
    console.group('📡 API 调用 - 删除任务');
    console.log('🔗 请求:', `DELETE /api/tasks/${testTaskId}`);

    try {
      const response = await deleteTask(testTaskId);
      console.log('✅ 成功:', response);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState, testTaskId]);

  /**
   * 测试标记任务完成
   */
  const testMarkComplete = useCallback(async () => {
    const index = 5;
    updateLoadingState(index, null);
    console.group('📡 API 调用 - 标记任务完成');
    console.log('🔗 请求:', `PATCH /api/tasks/${testTaskId}/complete`);

    try {
      const response = await markTaskComplete(testTaskId);
      console.log('✅ 成功:', response);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState, testTaskId]);

  /**
   * 测试标记任务未完成
   */
  const testMarkPending = useCallback(async () => {
    const index = 6;
    updateLoadingState(index, null);
    console.group('📡 API 调用 - 标记任务未完成');
    console.log('🔗 请求:', `PATCH /api/tasks/${testTaskId}/pending`);

    try {
      const response = await markTaskPending(testTaskId);
      console.log('✅ 成功:', response);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState, testTaskId]);

  /**
   * 测试获取当前提醒
   */
  const testGetReminders = useCallback(async () => {
    const index = 7;
    updateLoadingState(index, null);
    console.group('📡 API 调用 - 获取当前提醒');
    console.log('🔗 请求:', 'GET /api/reminders');

    try {
      const response = await getReminders();
      console.log('✅ 成功:', response);
      updateLoadingState(index, 'success');
    } catch (error) {
      console.error('❌ 失败:', error);
      updateLoadingState(index, 'error');
    } finally {
      console.groupEnd();
    }
  }, [updateLoadingState]);

  /** 测试项列表 */
  const testItems: IApiTestItem[] = [
    { label: '查询所有任务', method: 'GET', path: '/api/tasks', action: testGetTaskList },
    { label: '根据 ID 查询', method: 'GET', path: '/api/tasks/{id}', action: testGetTaskById },
    { label: '创建新任务', method: 'POST', path: '/api/tasks', action: testCreateTask },
    { label: '更新指定任务', method: 'PUT', path: '/api/tasks/{id}', action: testUpdateTask },
    { label: '删除指定任务', method: 'DELETE', path: '/api/tasks/{id}', action: testDeleteTask },
    { label: '标记为完成', method: 'PATCH', path: '/api/tasks/{id}/complete', action: testMarkComplete },
    { label: '标记为未完成', method: 'PATCH', path: '/api/tasks/{id}/pending', action: testMarkPending },
    { label: '获取待提醒任务', method: 'GET', path: '/api/reminders', action: testGetReminders },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8 p-6 bg-white rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">API 接口测试</h1>
          <p className="text-sm text-gray-500 m-0">点击下方按钮测试接口，结果请查看浏览器控制台</p>
        </div>

        {/* 测试任务 ID 输入 */}
        <div className="flex items-center gap-3 p-4 mb-4 bg-white rounded-lg shadow-sm">
          <label htmlFor="taskId" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            测试任务 ID
          </label>
          <input
            id="taskId"
            type="number"
            className="w-25 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            value={testTaskId}
            onChange={(e) => setTestTaskId(Number(e.target.value))}
            min="1"
          />
          <span className="text-xs text-gray-400">创建任务成功后自动更新</span>
        </div>

        {/* 测试按钮列表 */}
        <div className="flex flex-col gap-3">
          {testItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                loadingIndex === index ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-semibold font-mono ${
                  METHOD_STYLES[item.method] || 'bg-gray-100 text-gray-700'
                }`}>
                  {item.method}
                </span>
                <span className="font-mono text-sm text-gray-600 truncate">{item.path}</span>
              </div>
              <button
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                disabled={loadingIndex !== null}
                onClick={item.action}
              >
                {loadingIndex === index ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>请求中...</span>
                  </>
                ) : itemStates[index] === 'success' ? (
                  <>
                    <span className="text-emerald-500">✓</span>
                    <span>成功</span>
                  </>
                ) : itemStates[index] === 'error' ? (
                  <>
                    <span className="text-red-500">✕</span>
                    <span>重试</span>
                  </>
                ) : (
                  <span>测试</span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* 控制台提示 */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
          <p className="m-0 text-sm text-gray-400">📌 打开浏览器开发者工具（F12）查看控制台日志</p>
        </div>
      </div>
    </div>
  );
}
