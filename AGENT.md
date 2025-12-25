# AGENT.md

This file provides guidance to AI assistants when working with code in this repository.

## 项目概述

这是一个移动端 H5 待办清单应用项目，包含两个独立的实现版本：
- `angular-h5/` - Angular 20 + TypeScript 实现版本
- `react-h5/` - React + Vite + TypeScript 实现版本
- `docs-api/` - 后端 API 接口文档

详细需求见 [h5需求分析.md](./h5需求分析.md)。

## 开发命令

### Angular 项目 (`angular-h5/`)

```bash
cd angular-h5

# 启动开发服务器 (http://localhost:4200)
npm start

# 构建生产版本
npm run build

# 运行单元测试
npm test

# 代码脚手架：生成组件/服务/管道等
ng generate component component-name
ng generate service service-name
ng generate directive directive-name
```

### React 项目 (`react-h5/`)

```bash
cd react-h5

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

### 包管理

项目使用 npm，配置了阿里云镜像源（见 [`.npmrc`](./.npmrc)）。

## 技术栈

### Angular 主版本技术栈
- **框架**: Angular 20.3 + TypeScript 5.9
- **样式**: SCSS + Tailwind CSS v3
- **图表**: Chart.js（需移动端适配）
- **图标**: Font Awesome
- **时间处理**: Day.js
- **数据存储**: localStorage（当前）/ REST API（未来）
- **路由**: Angular Router

### React 版本技术栈
- **框架**: React 19 + TypeScript 5.9
- **构建工具**: Vite 7
- **样式**: SCSS + Tailwind CSS v3

## 架构设计

### 功能模块（待实现）
1. **任务列表页** - 支持筛选（全部/未完成/已完成）、排序（最新/截止/优先级）
2. **任务新增/编辑页** - 表单验证、截止时间选择、优先级设置
3. **任务详情页** - 完整信息展示、状态管理
4. **数据统计页** - Chart.js 图表展示完成率、趋势、分布
5. **提醒功能** - 长轮询获取提醒、浏览器通知

### API 接口规范
所有接口统一响应格式（见 [docs-api/README.md](./docs-api/README.md)）：
```typescript
{
  success: boolean,
  data: T,
  message: string,
  error?: { code: string, message: string, details: string },
  timestamp: string
}
```

接口清单：
| 接口 | 方法 | 路径 |
| :--- | :--- | :--- |
| 获取任务列表 | GET | `/api/tasks` |
| 获取单个任务 | GET | `/api/tasks/{id}` |
| 创建新任务 | POST | `/api/tasks` |
| 更新任务 | PUT/PATCH | `/api/tasks/{id}` |
| 删除任务 | DELETE | `/api/tasks/{id}` |
| 标记完成 | PATCH | `/api/tasks/{id}/complete` |
| 标记未完成 | PATCH | `/api/tasks/{id}/pending` |
| 获取提醒 | GET | `/api/reminders` |

## 通用开发规范

### 交互规范
- 交互全程使用中文交流
- 当需要对代码进行修改时，必须先暂停操作，用条理化的方式描述你的方案（描述过程不需要代码演示），等待明确确认后，才能实施具体修改
- 修改结束后仅需在对话中生成最终总结，不要生成中间过程文档
- 只实现当前需求必要的功能
- 不需要写兼容性强的代码，除非特别要求

### 代码规范
- **命名规范**：
  - 变量、函数等名称必须具有自解释性
  - 类型定义（接口）名称统一以大写字母 `I` 开头（如 `IUserData`）
- **编程范式**：遵循函数式编程范式，优先使用纯函数和不可变数据结构
- **组件设计原则**：
  - 页面组件和 UI 组件保持单一职责
  - 使用组件组合而非继承
  - 逻辑与 UI 分离
  - 样式优先使用 SCSS + Tailwind CSS v3
  - 样式优先使用 SCSS + Tailwind CSS v3
  - React 项目使用 hooks 管理数据，保持组件纯净
- **组件目录**: React 项目每个组件和页面需要单独目录，包含 `index.tsx`，有样式时需包含 `index.scss`，如果逻辑复杂需要组件拆分
- **注释规范**：在关键逻辑、复杂算法或其他重要部分添加简明注释，解释代码的作用和意图

### 文件组织规范
- 每个文件顶部必须包含文件说明注释
- 单个代码文件不应超过 300 行，超出应进行拆分

### 版本控制规范
- 不要自动提交 Git，除非特别要求
- 若涉及 Git 提交，务必遵循标准的提交消息规范
- 提交信息应简短、清晰且符合约定
