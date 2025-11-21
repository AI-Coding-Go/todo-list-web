/**
 * 任务状态管理
 */
import { create } from 'zustand'
import { ITodo, FilterType, SortType, Priority } from '@/types'
import { todoStorage } from '@/utils/storage'
import { generateId, isOverdue } from '@/utils/date'

interface ITodoStore {
  // 状态
  todos: ITodo[]
  filterType: FilterType
  sortType: SortType
  
  // 操作
  addTodo: (todo: Omit<ITodo, 'id' | 'createdAt'>) => void
  updateTodo: (id: string, updates: Partial<ITodo>) => void
  deleteTodo: (id: string) => void
  toggleTodoStatus: (id: string) => void
  getTodoById: (id: string) => ITodo | null
  
  // 筛选和排序
  setFilterType: (filterType: FilterType) => void
  setSortType: (sortType: SortType) => void
  
  // 获取过滤和排序后的任务
  getFilteredTodos: () => ITodo[]
}

// 优先级权重
const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
}

export const useTodoStore = create<ITodoStore>((set, get) => ({
  // 初始状态
  todos: todoStorage.getTodos(),
  filterType: 'all',
  sortType: 'createdAt',
  
  // 添加任务
  addTodo: (todoData) => {
    const newTodo: ITodo = {
      ...todoData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    
    // 更新状态
    set((state) => ({
      todos: [...state.todos, newTodo],
    }))
    
    // 更新本地存储
    todoStorage.addTodo(newTodo)
  },
  
  // 更新任务
  updateTodo: (id, updates) => {
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
      return { todos: updatedTodos }
    })
    
    // 更新本地存储
    todoStorage.updateTodo(id, updates)
  },
  
  // 删除任务
  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }))
    
    // 更新本地存储
    todoStorage.deleteTodo(id)
  },
  
  // 切换任务状态
  toggleTodoStatus: (id) => {
    const currentTodos = get().todos
    const todo = currentTodos.find((t) => t.id === id)
    
    if (!todo) return
    
    const newStatus = todo.status === 'pending' ? 'completed' : 'pending'
    
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
            }
          : t
      ),
    }))
    
    // 更新本地存储
    todoStorage.updateTodo(id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    })
  },
  
  // 根据ID获取任务
  getTodoById: (id) => {
    const todos = get().todos
    return todos.find(todo => todo.id === id) || null
  },
  
  // 设置筛选类型
  setFilterType: (filterType) => {
    set({ filterType })
  },
  
  // 设置排序类型
  setSortType: (sortType) => {
    set({ sortType })
  },
  
  // 获取过滤和排序后的任务
  getFilteredTodos: () => {
    const { todos, filterType, sortType } = get()
    
    // 筛选任务
    let filteredTodos = todos.filter((todo) => {
      switch (filterType) {
        case 'pending':
          return todo.status === 'pending'
        case 'completed':
          return todo.status === 'completed'
        default:
          return true
      }
    })
    
    // 排序任务
    filteredTodos.sort((a, b) => {
      switch (sortType) {
        case 'createdAt':
          // 创建时间倒序
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        
        case 'dueDate':
          // 截止时间正序，无截止时间的排在最后
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        
        case 'priority':
          // 优先级降序，同优先级按创建时间倒序
          const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority]
          if (priorityDiff !== 0) return priorityDiff
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        
        default:
          return 0
      }
    })
    
    return filteredTodos
  },
}))