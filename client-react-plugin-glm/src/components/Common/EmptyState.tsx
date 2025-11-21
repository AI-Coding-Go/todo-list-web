/**
 * 空状态组件
 */
import React from 'react'

interface IEmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

const EmptyState: React.FC<IEmptyStateProps> = ({ 
  icon = 'fas fa-inbox', 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <i className={`${icon} text-4xl text-gray-400 mb-4`}></i>
      <h3 className="text-base font-medium text-gray-600 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 px-4">{description}</p>
      )}
      {action}
    </div>
  )
}

export default EmptyState