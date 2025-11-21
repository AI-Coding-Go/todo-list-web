/**
 * 任务新增/编辑页面
 */
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTodoStore } from '@/store/todoStore'
import { ITodo, Priority } from '@/types'
import Header from '@/components/Common/Header'
import LoadingSpinner from '@/components/Common/LoadingSpinner'

const TodoForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addTodo, updateTodo, getTodoById } = useTodoStore()
  const [loading, setLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Priority,
  })
  
  // 表单错误
  const [errors, setErrors] = useState({
    title: '',
  })
  
  // 判断是新增还是编辑
  const isEditing = !!id
  
  // 初始化数据
  useEffect(() => {
    if (isEditing && id) {
      const todo = getTodoById(id)
      if (todo) {
        setFormData({
          title: todo.title,
          description: todo.description,
          dueDate: todo.dueDate || '',
          priority: todo.priority,
        })
      } else {
        navigate('/')
      }
    }
  }, [id, isEditing, getTodoById, navigate])
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)
    
    // 清除错误提示
    if (errors.title && name === 'title') {
      setErrors(prev => ({ ...prev, title: '' }))
    }
  }
  
  // 处理优先级选择
  const handlePriorityChange = (priority: Priority) => {
    setFormData(prev => ({ ...prev, priority }))
    setHasUnsavedChanges(true)
  }
  
  // 表单验证
  const validateForm = () => {
    let isValid = true
    const newErrors = { title: '' }
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入任务标题'
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }
  
  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      if (isEditing) {
        // 更新任务
        updateTodo(id!, formData)
      } else {
        // 新增任务
        addTodo({
          ...formData,
          status: 'pending',
        })
      }
      
      navigate('/')
    } catch (error) {
      console.error('保存任务失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 处理返回
  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm('您有未保存的更改，确定要离开吗？')) {
        navigate(-1)
      }
    } else {
      navigate(-1)
    }
  }
  
  // 优先级选项
  const priorityOptions: Array<{ value: Priority; label: string; color: string }> = [
    { value: 'high', label: '高', color: 'bg-red-100 text-red-600' },
    { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-600' },
    { value: 'low', label: '低', color: 'bg-green-100 text-green-600' },
  ]
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title={isEditing ? '编辑任务' : '新增任务'}
        showBack={true}
      />
      
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4">
          {/* 任务标题 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={50}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入任务标题"
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <span className="text-xs text-red-500">{errors.title}</span>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {formData.title.length}/50
              </span>
            </div>
          </div>
          
          {/* 任务描述 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务描述
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={500}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="请输入任务描述"
            />
            <div className="text-right mt-1">
              <span className="text-xs text-gray-500">
                {formData.description.length}/500
              </span>
            </div>
          </div>
          
          {/* 截止时间 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              截止时间
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* 优先级 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              优先级
            </label>
            <div className="flex gap-2">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    formData.priority === option.value
                      ? option.color
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => handlePriorityChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
      
      {/* 底部操作栏 */}
      <div className="h-16 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
        <div className="flex gap-3 h-full">
          <button
            type="button"
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            onClick={handleBack}
          >
            取消
          </button>
          <button
            type="button"
            className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                保存中...
              </>
            ) : (
              '保存'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoForm