# 待办清单 H5 应用

一个基于 React + TypeScript 的移动端待办清单应用，支持任务的添加、编辑、完成、删除等功能，并包含数据统计和提醒功能。

## 功能特点

- ✅ 任务管理：添加、编辑、完成、删除任务
- 🏷️ 优先级设置：高、中、低三级优先级
- ⏰ 截止时间：设置任务截止时间，支持逾期提醒
- 🔍 筛选功能：全部、未完成、已完成任务筛选
- 📊 排序功能：按创建时间、截止时间、优先级排序
- 📈 数据统计：完成率、趋势图、状态分布可视化
- 🔔 提醒功能：截止前提醒，逾期提醒
- 📱 移动端适配：专为移动设备优化

## 技术栈

- **框架**：React 18 + TypeScript
- **路由**：React Router v6
- **状态管理**：Zustand
- **样式**：Tailwind CSS + Less
- **图表**：Chart.js + react-chartjs-2
- **图标**：Font Awesome
- **日期处理**：day.js
- **构建工具**：Vite

## 开发指南

### 安装依赖

```bash
cd client-react-plugin-glm
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── Common/         # 通用组件
│   ├── Layout/         # 布局组件
│   ├── Reminder/       # 提醒组件
│   └── Todo/           # 待办事项组件
├── pages/              # 页面组件
├── store/              # 状态管理
├── types/              # 类型定义
├── utils/              # 工具函数
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## 设计理念

1. **移动优先**：专为移动设备设计，优化触摸体验
2. **简约高效**：简洁的界面设计，提高操作效率
3. **数据本地化**：使用 localStorage 存储数据，保证离线可用
4. **响应式设计**：适配不同尺寸的移动设备
5. **无障碍支持**：遵循基本的无障碍设计原则

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端 WebView

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 组件采用函数式编程范式
- 代码注释遵循 JSDoc 规范
- 单个文件不超过 200 行

## 许可证

MIT License