/**
 * 任务详情页面
 */
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTodoStore } from '@/store/todoStore'
import { formatFullDateTime, isOverdue } from '@/utils/date'
import Header from '@/components/Common/Header'

const TodoDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTodoById, toggleTodoStatus, deleteTodo } = useTodoStore()
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  
  // 获取任务详情
  const todo = id ? getTodoById(id) : undefined
  
  // 如果任务不存在，返回列表页
  if (!todo) {
    navigate('/')
    return null
  }
  
  // 处理编辑任务
  const handleEdit = () => {
    navigate(`/todo/${id}/edit`)
  }
  
  // 处理切换任务状态
  const handleToggleStatus = () => {
    toggleTodoStatus(todo.id)
  }
  
  // 处理删除任务
  const handleDelete = () => {
    setDeleteConfirm(true)
  }
  
  // 确认删除
  const confirmDelete = () => {
    deleteTodo(todo.id)
    navigate('/')
  }
  
  // 取消删除
  const cancelDelete = () => {
    setDeleteConfirm(false)
  }
  
  // 获取优先级标签信息
  const getPriorityInfo = () => {
    switch (todo.priority) {
      case 'high':
        return { label: '高', className: 'bg-red-100 text-red-600' }
      case 'medium':
        return { label: '中', className: 'bg-yellow-100 text-yellow-600' }
      case 'low':
        return { label: '低', className: 'bg-green-100 text-green-600' }
      default:
        return { label: '中', className: 'bg-yellow-100 text-yellow-600' }
    }
  }
  
  const priorityInfo = getPriorityInfo()
  const isOverdueItem = todo.dueDate && isOverdue(todo.dueDate) && todo.status === 'pending'
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="任务详情"
        showBack={true}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white">
          {/* 任务标题和优先级 */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center mb-2">
              <span className={`text-xs px-2 py-1 rounded ${priorityInfo.className}`}>
                {priorityInfo.label}优先级
              </span>
              <span className={`ml-auto text-xs ${
                todo.status === 'completed' ? 'text-green-500' : 'text-orange-500'
              }`}>
                {todo.status === 'completed' ? '已完成' : '未完成'}
              </span>
            </div>
            <h2 className={`text-lg font-medium ${
              todo.status === 'completed' ? 'text-gray-500' : 'text-gray-900'
            }`}>
              {todo.title}
            </h2>
          </div>
          
          {/* 任务信息 */}
          <div className="p-4 border-b border-gray-100">
            <div className="space-y-3">
              {/* 完成时间 */}
              {todo.status === 'completed' && todo.completedAt && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">完成时间</span>
                  <span>{formatFullDateTime(todo.completedAt)}</span>
                </div>
              )}
              
              {/* 截止时间 */}
              {todo.dueDate && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">截止时间</span>
                  <span className={isOverdueItem ? 'text-red-500 font-medium' : ''}>
                    {formatFullDateTime(todo.dueDate)}
                    {isOverdueItem && ' (已逾期)'}
                  </span>
                </div>
              )}
              
              {/* 创建时间 */}
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-20">创建时间</span>
                <span>{formatFullDateTime(todo.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* 任务描述 */}
          {todo.description && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">任务描述</h3>
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {todo.description}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <div className="grid grid-cols-3 gap-3">
          <button
            className="py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
            onClick={handleEdit}
          >
            <i className="fas fa-edit mr-1"></i>
            编辑
          </button>
          <button
            className={`py-2 rounded-lg text-sm font-medium ${
              todo.status === 'pending' 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 text-white'
            }`}
            onClick={handleToggleStatus}
          >
            <i className={`fas ${
              todo.status === 'pending' 
                ? 'fa-check' 
                : 'fa-undo'
            } mr-1`}></i>
            {todo.status === 'pending' ? '完成' : '撤销'}
          </button>
          <button
            className="py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
            onClick={handleDelete}
          >
            <i className="fas fa-trash mr-1"></i>
            删除
          </button>
        </div>
      </div>
      
      {/* 删除确认弹窗 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-base font-medium mb-2">确认删除</h3>
            <p className="text-sm text-gray-600 mb-6">
              确定删除该任务？删除后不可恢复
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
                onClick={cancelDelete}
              >
                取消
              </button>
              <button
                className="flex-1 py-2 bg-danger text-white rounded-lg text-sm"
                onClick={confirmDelete}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoDetail