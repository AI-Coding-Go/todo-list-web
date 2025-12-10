# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## 交互规范

- 交互全程使用中文交流
- 当需要对代码进行修改时，必须先暂停操作，用条理化的方式描述你的方案（描述过程不需要代码演示），等待明确确认后，才能实施具体修改
- 修改结束后仅需在对话中生成最终总结，不要生成中间过程文档
- 不要自动提交 Git，除非特别要求
- 若涉及 Git 提交，务必遵循标准的提交消息规范，提交信息应简短、清晰且符合约定

## 开发原则

- 只实现当前需求必要的功能
- 注重代码的可读性和可维护性
- 在关键逻辑、复杂算法或其他重要部分添加简明注释，注释应解释代码的作用和意图
- 变量、函数等名称必须具有自解释性

## 开发命令

### 环境依赖
```bash
# 使用 pnpm 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本（同时进行类型检查）
pnpm build

# 代码质量检查
pnpm lint

# 预览生产版本
pnpm preview
```

### 项目启动
项目使用 Vite 作为构建工具，开发服务器运行在 `http://localhost:5173`

## 项目架构

这是一个基于 React 19 + TypeScript 的移动端待办清单应用，采用函数式组件和 Hooks 的现代开发模式。

### 核心架构模式

1. **单页面应用路由**：使用自定义 hash 路由实现的客户端路由系统，在 `src/App.tsx` 中管理
2. **状态管理**：通过自定义 Hooks 集中管理状态，主要使用 `useTasks` Hook 管理任务数据
3. **数据持久化**：使用 localStorage 存储所有数据，通过 `storageService` 服务统一管理
4. **组件架构**：按功能模块划分（ui、task、layout、reminder），采用函数式组件

### 关键文件说明

- **src/App.tsx**：应用主组件，管理路由和页面切换
- **src/hooks/useTasks.ts**：任务管理的核心 Hook，包含所有任务相关操作
- **src/hooks/useReminder.ts**：提醒功能的核心 Hook
- **src/services/storage.ts**：本地存储服务，封装所有 localStorage 操作
- **src/types/index.ts**：TypeScript 类型定义，包含 ITask、IStatistics 等核心接口
- **src/constants/index.ts**：应用常量定义，包括存储键名、配置选项等

### 数据流

```
用户操作 → 组件事件 → 自定义Hook → storageService → localStorage
                ↓
            组件重渲染 ← 状态更新 ← 数据同步
```

## 项目结构

```
src/
├── components/
│   ├── ui/              # 通用UI组件（Button、Input、Modal等）
│   ├── task/            # 任务相关组件（TaskItem、TaskForm等）
│   ├── layout/          # 布局组件（Header、BottomNav等）
│   └── reminder/        # 提醒功能组件
├── pages/               # 页面组件（TaskListPage、StatisticsPage等）
├── hooks/               # 自定义Hooks（useTasks、useReminder等）
├── services/            # 数据服务层（storage.ts）
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
├── constants/           # 常量定义
└── styles/              # 全局样式
```

## 核心功能模块

### 1. 任务管理
- 任务的增删改查通过 `useTasks` Hook 统一管理
- 支持优先级（high/medium/low）和状态（pending/completed）
- 使用 `filterTasks` 和 `sortTasks` 工具函数处理列表显示

### 2. 数据统计
- 通过 `getStatistics` 方法计算各种指标
- 使用 Chart.js 展示图表数据
- 支持完成率、优先级分布、趋势分析等

### 3. 提醒系统
- 基于浏览器通知 API
- 使用 `useReminder` Hook 管理提醒逻辑
- 支持稍后提醒和提醒历史记录

### 4. 路由管理
- 基于 hash 的客户端路由（#/task、#/statistics、#/settings）
- 支持浏览器前进后退
- 页面切换使用淡入淡出动画

## 编码规范

### 命名约定
- 类型定义（接口）名称统一以大写字母 "I" 开头（例如 `ITask`）
- 组件使用 PascalCase（如 `TaskItem`、`Button`）
- 变量和函数使用 camelCase（如 `addTask`、`filterTasks`）
- 常量使用 UPPER_SNAKE_CASE（如 `STORAGE_KEYS`）

### 组件开发
- 遵循函数式编程范式
- 优先使用纯函数和不可变数据结构
- 页面组件和UI组件保持单一职责
- 使用组件组合而非继承
- 逻辑与UI分离
- 每个组件文件顶部添加文件说明注释
- 单个代码文件不应超过300行，超出应进行拆分
- 不需要写兼容性强的代码，除非特别要求

### 状态管理
- 使用自定义 Hooks 封装业务逻辑
- 保持状态在顶层组件中管理
- 通过 callback 函数传递状态更新逻辑

### 样式规范
- 优先使用 Tailwind CSS
- 移动端优先设计（min-width 断点）
- 确保触摸目标最小 44x44px
- 使用响应式布局适配不同屏幕

## 重要提醒

1. **数据持久化**：所有数据都存储在 localStorage 中，注意存储容量限制
   - 任务数据存储在 `todo_tasks` 键下
   - 提醒设置存储在 `todo_settings` 键下
   - 提醒事件存储在 `todo_reminder_events` 键下

2. **类型安全**：使用 TypeScript 严格模式，所有数据都要有明确的类型定义
3. **性能优化**：使用 useCallback 和 useMemo 优化重渲染
4. **错误处理**：在 storageService 中添加了错误捕获，确保应用稳定性
5. **移动端适配**：所有交互都要考虑触摸操作，避免误触

## 常见问题解决

### 添加新功能
1. 在 `types/index.ts` 中定义相关类型
2. 在 `hooks/` 中创建管理 Hook
3. 在 `components/` 中实现UI组件
4. 在 `services/storage.ts` 中添加数据存储逻辑

### 修改数据结构
1. 更新 `types/index.ts` 中的接口定义
2. 在 `storageService` 中添加数据迁移逻辑
3. 更新相关的组件和 Hooks

### 调试技巧
- 使用 React DevTools 查看组件状态
- 在 Chrome DevTools Application 标签页查看 localStorage 数据
- 使用 console.log 在 Hooks 中跟踪数据流