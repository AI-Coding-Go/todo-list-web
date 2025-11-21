/**
 * 任务筛选组件
 */
import React from 'react'
import { FilterType } from '@/types'
import clsx from 'classnames'

interface ITodoFilterProps {
  filterType: FilterType
  onFilterChange: (filterType: FilterType) => void
}

const TodoFilter: React.FC<ITodoFilterProps> = ({ filterType, onFilterChange }) => {
  const filterOptions: Array<{ key: FilterType; label: string }> = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '未完成' },
    { key: 'completed', label: '已完成' },
  ]
  
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex bg-gray-100 rounded-lg p-1">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            className={clsx(
              'flex-1 py-1.5 text-sm rounded-md transition-colors',
              filterType === option.key
                ? 'bg-white text-primary shadow-sm font-medium'
                : 'text-gray-600'
            )}
            onClick={() => onFilterChange(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TodoFilter