# Angular H5 待办清单应用

基于 Angular 20 + TypeScript 开发的移动端待办清单应用。

## 技术栈

- **框架**: Angular 20.3 + TypeScript 5.9
- **构建工具**: Angular CLI
- **样式**: SCSS + Tailwind CSS v3
- **图表**: Chart.js（移动端适配）
- **时间处理**: Day.js
- **状态管理**: Angular Signals
- **路由**: Angular Router

## 项目结构

```
src/app/
├── core/                    # 核心层
│   ├── services/
│   │   ├── api.service.ts           # API 接口封装
│   │   ├── task.service.ts          # 任务状态管理 (Signals)
│   │   └── reminder.service.ts      # 提醒轮询服务
│   └── models/
│       └── api.model.ts             # API 类型定义
│
├── features/                # 功能模块（页面组件）
│   ├── task-list/                   # 任务列表页
│   ├── task-edit/                   # 任务新增/编辑页
│   ├── task-detail/                 # 任务详情页
│   ├── statistics/                  # 数据统计页
│   └── settings/                    # 设置页
│
├── shared/                  # 共享层
│   ├── components/
│   │   ├── top-bar/                 # 顶部标题栏
│   │   ├── bottom-nav/              # 底部导航栏
│   │   ├── fab-button/              # 悬浮操作按钮
│   │   ├── confirm-dialog/          # 确认弹窗
│   │   ├── reminder-bar/            # 提醒悬浮条
│   │   └── empty-state/             # 空状态占位
│   └── utils/
│       └── date.util.ts             # 日期工具函数
│
├── routes/                  # 路由配置
│   └── routes.ts
├── app.ts                   # 根组件
├── app.html
└── app.scss
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:4200)
npm start

# 构建生产版本
npm run build

# 运行单元测试
npm test

# 代码脚手架
ng generate component component-name
ng generate service service-name
ng generate directive directive-name
```

## 功能实现

### 任务列表页 (`task-list`)

- 任务筛选：全部 / 未完成 / 已完成
- 任务排序：最新添加 / 即将截止 / 优先级
- 任务操作：完成/未完成切换、编辑、删除
- 空状态占位展示

### 任务新增/编辑页 (`task-edit`)

- ReactiveForms 表单验证
- 任务标题（必填，限 50 字）
- 任务描述（可选，限 500 字）
- 截止时间选择器
- 优先级选择（高/中/低）

### 任务详情页 (`task-detail`)

- 完整任务信息展示
- 优先级颜色标签
- 状态切换（完成/未完成）
- 编辑、删除操作

### 数据统计页 (`statistics`)

- Chart.js 图表展示
  - 完成率柱状图
  - 趋势折线图（近 7 天）
  - 状态分布饼图
- Tab 切换图表类型

### 设置页 (`settings`)

- 提醒开关控制
- 浏览器通知权限管理
- 应用版本信息

### 提醒功能 (`reminder.service`)

- 长轮询获取提醒（30秒间隔）
- 浏览器桌面通知集成
- 提醒状态持久化（localStorage）

## Angular 特性使用

### Standalone Components

```typescript
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TopBarComponent, ...],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent { }
```

### Signals 状态管理

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks = signal<ITodoTaskResponse[]>([]);
  filter = signal<ETaskFilter>('all');

  // 自动派生状态
  sortedTasks = computed(() => {
    // 自动追踪依赖，无需手动管理
    return this.tasks().sort(...)
  });
}
```

### 新版控制流

```html
<!-- 条件渲染 -->
@if (tasks().length > 0) {
  <div>任务列表</div>
} @else {
  <app-empty-state />
}

<!-- 循环渲染 -->
@for (task of tasks(); track task.id) {
  <div>{{ task.title }}</div>
}
```

### input() / output() API

```typescript
export class ConfirmDialogComponent {
  open = input.required<boolean>();
  title = input('确定');
  confirm = output<void>();
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

## 构建结果

```bash
npm run build

# 输出：
main-26HEYSTP.js      | main          | 549.36 kB
polyfills-5CFQRCPP.js | polyfills     |  34.59 kB
styles-SR33WZBP.css   | styles        |  13.22 kB
```

## 相关链接

- [Angular 官方文档](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [Chart.js 文档](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
