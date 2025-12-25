# React H5 待办清单应用

基于 React 19 + Vite + TypeScript 开发的移动端待办清单应用。

## 技术栈

- **框架**: React 19 + TypeScript 5.9
- **构建工具**: Vite 7
- **路由**: react-router
- **样式**: SCSS + Tailwind CSS v3
- **图表**: Chart.js + react-chartjs-2
- **时间处理**: Day.js
- **状态管理**: Custom Hooks
- **代码规范**: ESLint + TypeScript ESLint

## 项目结构

```
src/
├── api/                     # API 接口封装
│   ├── index.ts                     # 统一导出
│   └── task.ts                      # 任务相关接口
│
├── components/              # 通用组件
│   ├── TopBar/                     # 顶部标题栏
│   ├── BottomNav/                  # 底部导航栏
│   ├── FabButton/                  # 悬浮操作按钮
│   ├── ConfirmDialog/              # 确认弹窗
│   ├── ReminderBar/                # 提醒悬浮条
│   └── EmptyState/                 # 空状态占位
│
├── hooks/                   # 自定义 Hooks
│   ├── useTasks.ts                 # 任务状态管理
│   ├── useReminder.ts              # 提醒轮询
│   └── useConfirm.ts               # 确认弹窗状态
│
├── pages/                   # 页面组件
│   ├── TaskList/                   # 任务列表页
│   ├── TaskEdit/                   # 任务新增/编辑页
│   ├── TaskDetail/                 # 任务详情页
│   ├── Statistics/                 # 数据统计页
│   └── Settings/                   # 设置页
│
├── types/                   # 类型定义
│   └── index.ts                    # API 类型
│
├── utils/                   # 工具函数
│   └── date.ts                     # 日期格式化
│
├── App.tsx                  # 根组件
├── main.tsx                 # 应用入口
└── vite-env.d.ts            # Vite 类型声明
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

## 功能实现

### 任务列表页 (`TaskList`)

- 任务筛选：全部 / 未完成 / 已完成
- 任务排序：最新添加 / 即将截止 / 优先级
- 任务操作：完成/未完成切换、编辑、删除
- 空状态占位展示

### 任务新增/编辑页 (`TaskEdit`)

- 表单验证（标题必填、字数限制）
- 任务标题（必填，限 50 字）
- 任务描述（可选，限 500 字）
- 截止时间选择器
- 优先级选择（高/中/低）

### 任务详情页 (`TaskDetail`)

- 完整任务信息展示
- 优先级颜色标签
- 状态切换（完成/未完成）
- 编辑、删除操作

### 数据统计页 (`Statistics`)

- Chart.js 图表展示（react-chartjs-2）
  - 完成率柱状图
  - 趋势折线图（近 7 天）
  - 状态分布饼图
- Tab 切换图表类型

### 设置页 (`Settings`)

- 提醒开关控制
- 浏览器通知权限管理
- 应用版本信息

### 提醒功能 (`useReminder`)

- 长轮询获取提醒（30秒间隔）
- 浏览器桌面通知集成
- 提醒状态持久化（localStorage）

## React Hooks 状态管理

```typescript
// useTasks.ts - 任务状态管理
export function useTasks() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');

  // 使用 useMemo 自动派生筛选后的任务列表
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => ...)
  }, [tasks, filter]);

  return { tasks, filteredTasks, ... };
}
```

```typescript
// 组件中使用
function TaskList() {
  const { tasks, loading, toggleTask, deleteTask } = useTasks();
  const { reminders } = useReminder();

  // ...
}
```

## API 接口

详见 `docs-api/README.md`

| 接口 | 方法 | 路径 |
|:---|:---|:---|
| 获取任务列表 | GET | `/api/tasks` |
| 创建任务 | POST | `/api/tasks` |
| 更新任务 | PUT | `/api/tasks/{id}` |
| 删除任务 | DELETE | `/api/tasks/{id}` |
| 获取提醒 | GET | `/api/reminders` |

## 开发规范

- 变量、函数名称必须具有自解释性
- 类型定义（接口）名称统一以大写字母 `I` 开头
- 遵循函数式编程范式
- 每个文件顶部必须包含文件说明注释
- 单个代码文件不超过 300 行
- 组件和页面需要单独目录，包含 `index.tsx`，有样式时需包含 `index.scss`

## 构建结果

```bash
npm run build

# 输出：dist/index.html ~180 KB
```

## 相关链接

- [React 官方文档](https://react.dev)
- [Vite 文档](https://vite.dev)
- [React Router](https://reactrouter.com)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
