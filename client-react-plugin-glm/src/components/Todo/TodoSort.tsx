/**
 * 任务排序组件
 */
import React, { useState } from 'react'
import { SortType } from '@/types'

interface ITodoSortProps {
  sortType: SortType
  onSortChange: (sortType: SortType) => void
}

const TodoSort: React.FC<ITodoSortProps> = ({ sortType, onSortChange }) => {
  const [showSortOptions, setShowSortOptions] = useState(false)
  
  const sortOptions: Array<{ key: SortType; label: string }> = [
    { key: 'createdAt', label: '最新添加' },
    { key: 'dueDate', label: '即将截止' },
    { key: 'priority', label: '优先级' },
  ]
  
  const getCurrentLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortType)
    return option ? option.label : '排序'
  }
  
  const handleSortChange = (newSortType: SortType) => {
    onSortChange(newSortType)
    setShowSortOptions(false)
  }
  
  return (
    <div className="relative">
      <button
        className="bg-white px-4 py-3 border-b border-gray-100 w-full text-left flex items-center justify-between"
        onClick={() => setShowSortOptions(!showSortOptions)}
      >
        <div className="flex items-center">
          <i className="fas fa-sort text-gray-400 mr-2"></i>
          <span className="text-sm text-gray-600">排序方式：{getCurrentLabel()}</span>
        </div>
        <i 
          className={`fas fa-chevron-up text-gray-400 text-xs transition-transform ${
            showSortOptions ? 'rotate-180' : ''
          }`}
        ></i>
      </button>
      
      {showSortOptions && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowSortOptions(false)}
          ></div>
          
          {/* 选项列表 */}
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-lg border-t border-gray-100 z-20">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between ${
                  sortType === option.key ? 'text-primary font-medium' : 'text-gray-600'
                }`}
                onClick={() => handleSortChange(option.key)}
              >
                {option.label}
                {sortType === option.key && (
                  <i className="fas fa-check text-primary"></i>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TodoSort