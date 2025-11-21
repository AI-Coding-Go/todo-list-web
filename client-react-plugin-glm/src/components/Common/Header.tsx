/**
 * 通用头部组件
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface IHeaderProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

const Header: React.FC<IHeaderProps> = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate()
  
  const handleBack = () => {
    navigate(-1)
  }
  
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 safe-area-top">
      {showBack ? (
        <button
          onClick={handleBack}
          className="text-primary text-lg flex items-center justify-center w-8 h-8"
          aria-label="返回"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      ) : (
        <div className="w-8"></div>
      )}
      
      <h1 className="text-base font-medium text-center flex-1 mx-2 truncate">{title}</h1>
      
      <div className="w-8 flex justify-center">
        {rightAction}
      </div>
    </header>
  )
}

export default Header