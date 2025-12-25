/**
 * 任务新增/编辑页
 * 支持创建新任务和编辑已有任务
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import api from '@/services/api'
import TopBar from '@/components/TopBar'
import type { ETaskPriority } from '@/types/api'
import type { ITodoTaskCreateRequest, ITodoTaskUpdateRequest } from '@/types/api'

interface IFormData {
  title: string
  description: string
  deadline: string
  priority: ETaskPriority
}

const PRIORITY_OPTIONS: Array<{ value: ETaskPriority; label: string; color: string }> = [
  { value: 'HIGH', label: '高', color: 'text-red-500' },
  { value: 'MEDIUM', label: '中', color: 'text-amber-500' },
  { value: 'LOW', label: '低', color: 'text-green-500' },
]

const INITIAL_FORM_DATA: IFormData = {
  title: '',
  description: '',
  deadline: '',
  priority: 'MEDIUM',
}

export default function TaskEdit() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id

  const [formData, setFormData] = useState<IFormData>(INITIAL_FORM_DATA)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalData, setOriginalData] = useState<IFormData>(INITIAL_FORM_DATA)
  const [showPriorityPicker, setShowPriorityPicker] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // 加载任务数据（编辑模式）
  useEffect(() => {
    const loadTask = async () => {
      if (!id) return

      try {
        setLoading(true)
        const task = await api.getTaskById(Number(id))
        const newData: IFormData = {
          title: task.title,
          description: task.description || '',
          deadline: task.deadline ? task.deadline.slice(0, 16) : '',
          priority: task.priority,
        }
        setFormData(newData)
        setOriginalData(newData)
      } catch (err) {
        console.error('加载任务失败:', err)
        navigate('/', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadTask()
  }, [id, navigate])

  // 检测表单是否有变更
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData)
    setHasChanges(changed)
  }, [formData, originalData])

  // 处理返回
  const handleBack = useCallback(() => {
    if (hasChanges) {
      if (window.confirm('有未保存的修改，确定要离开吗？')) {
        navigate(-1)
      }
    } else {
      navigate(-1)
    }
  }, [hasChanges, navigate])

  // 处理输入变化
  const handleInputChange = useCallback((field: keyof IFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // 处理保存
  const handleSave = useCallback(async () => {
    // 验证标题
    if (!formData.title.trim()) {
      alert('请输入任务标题')
      titleInputRef.current?.focus()
      return
    }

    if (formData.title.length > 50) {
      alert('任务标题不能超过 50 字')
      return
    }

    if (formData.description.length > 500) {
      alert('任务描述不能超过 500 字')
      return
    }

    try {
      setLoading(true)

      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        deadline: formData.deadline ? dayjs(formData.deadline).format('YYYY-MM-DDTHH:mm:ss') : undefined,
        priority: formData.priority,
      }

      if (isEditMode && id) {
        // 更新任务
        const updateData: ITodoTaskUpdateRequest = {
          title: requestData.title,
          description: requestData.description,
          deadline: requestData.deadline,
          priority: requestData.priority,
        }
        await api.updateTask(Number(id), updateData)
      } else {
        // 创建任务
        const createData: ITodoTaskCreateRequest = requestData
        await api.createTask(createData)
      }

      navigate('/')
    } catch (err) {
      console.error('保存失败:', err)
      alert(err instanceof Error ? err.message : '保存失败')
    } finally {
      setLoading(false)
    }
  }, [formData, isEditMode, id, navigate])

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">加载中...</span>
      </div>
    )
  }

  const priorityLabel = PRIORITY_OPTIONS.find((p) => p.value === formData.priority)?.label || '中'

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <TopBar
        title={isEditMode ? '编辑任务' : '新增任务'}
        showBack
        onBack={handleBack}
        rightContent={<span className="text-blue-500">保存</span>}
        onRightClick={handleSave}
      />

      {/* 主内容区 */}
      <main className="pt-14 px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 任务标题 */}
          <div className="p-4 border-b border-gray-100">
            <input
              ref={titleInputRef}
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="请输入任务标题"
              maxLength={50}
              className="w-full text-lg font-medium outline-none placeholder-gray-300"
              disabled={loading}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.title.length}/50
            </div>
          </div>

          {/* 任务描述 */}
          <div className="p-4 border-b border-gray-100">
            <label className="block text-sm text-gray-500 mb-2">任务描述（可选）</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="添加任务描述..."
              maxLength={500}
              rows={4}
              className="w-full text-sm outline-none resize-none placeholder-gray-300"
              disabled={loading}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.description.length}/500
            </div>
          </div>

          {/* 截止时间 */}
          <div className="p-4 border-b border-gray-100">
            <label className="block text-sm text-gray-500 mb-2">截止时间（可选）</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="w-full text-sm outline-none"
              disabled={loading}
            />
          </div>

          {/* 优先级选择 */}
          <div className="p-4">
            <label className="block text-sm text-gray-500 mb-2">优先级</label>
            <button
              type="button"
              onClick={() => setShowPriorityPicker(!showPriorityPicker)}
              className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
              disabled={loading}
            >
              <span className={`font-medium ${PRIORITY_OPTIONS.find((p) => p.value === formData.priority)?.color}`}>
                {priorityLabel}优先级
              </span>
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`transition-transform ${showPriorityPicker ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* 优先级选择面板 */}
            {showPriorityPicker && (
              <div className="mt-2 bg-gray-50 rounded-lg overflow-hidden">
                {PRIORITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      handleInputChange('priority', option.value)
                      setShowPriorityPicker(false)
                    }}
                    className={`w-full py-3 px-4 text-left flex items-center justify-between ${
                      formData.priority === option.value ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className={option.color}>{option.label}优先级</span>
                    {formData.priority === option.value && (
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 取消按钮 */}
        <button
          type="button"
          onClick={handleBack}
          className="w-full mt-6 py-3 bg-white text-gray-600 rounded-lg font-medium active:bg-gray-50"
          disabled={loading}
        >
          取消
        </button>
      </main>
    </div>
  )
}
