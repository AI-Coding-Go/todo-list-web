/**
 * 任务列表页面
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTodoStore } from '@/store/todoStore'
import TodoItem from '@/components/Todo/TodoItem'
import TodoFilter from '@/components/Todo/TodoFilter'
import TodoSort from '@/components/Todo/TodoSort'
import EmptyState from '@/components/Common/EmptyState'

const TodoList: React.FC = () => {
  const navigate = useNavigate()
  const { todos, filterType, sortType, setFilterType, setSortType, getFilteredTodos } = useTodoStore()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  
  // 获取过滤后的任务
  const filteredTodos = getFilteredTodos()
  
  // 处理切换任务状态
  const handleToggleStatus = (id: string) => {
    const { toggleTodoStatus } = useTodoStore.getState()
    toggleTodoStatus(id)
  }
  
  // 处理编辑任务
  const handleEdit = (id: string) => {
    navigate(`/todo/${id}/edit`)
  }
  
  // 处理删除任务
  const handleDelete = (id: string) => {
    setDeleteTarget(id)
  }
  
  // 确认删除
  const confirmDelete = () => {
    if (deleteTarget) {
      const { deleteTodo } = useTodoStore.getState()
      deleteTodo(deleteTarget)
      setDeleteTarget(null)
    }
  }
  
  // 取消删除
  const cancelDelete = () => {
    setDeleteTarget(null)
  }
  
  // 跳转到新增页面
  const handleAddTodo = () => {
    navigate('/todo/new')
  }
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部标题栏 */}
      <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-center px-4 safe-area-top">
        <h1 className="text-base font-medium">待办清单</h1>
      </header>
      
      {/* 筛选和排序 */}
      <TodoFilter filterType={filterType} onFilterChange={setFilterType} />
      <TodoSort sortType={sortType} onSortChange={setSortType} />
      
      {/* 任务列表 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredTodos.length > 0 ? (
          <ul>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon="fas fa-clipboard-list"
            title={
              filterType === 'pending' ? '没有未完成的任务' :
              filterType === 'completed' ? '没有已完成的任务' :
              '暂无任务'
            }
            description={filterType === 'all' ? '点击右下角按钮添加您的第一个任务' : ''}
            action={
              filterType === 'all' && (
                <button
                  className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-full"
                  onClick={handleAddTodo}
                >
                  添加任务
                </button>
              )
            }
          />
        )}
      </div>
      
      {/* 悬浮添加按钮 */}
      <button
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-10"
        onClick={handleAddTodo}
        aria-label="添加任务"
      >
        <i className="fas fa-plus text-lg"></i>
      </button>
      
      {/* 删除确认弹窗 */}
      {deleteTarget && (
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

export default TodoList