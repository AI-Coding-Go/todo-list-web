# Todo API 接口文档

本目录包含 Todo 任务管理系统的 API 接口文档。

## 接口列表

| 接口名称 | 请求方式 | 接口地址 | 描述 |
| :--- | :--- | :--- | :--- |
| [获取任务列表](./获取任务列表.md) | GET | `/api/tasks` | 获取所有任务列表 |
| [获取单个任务](./获取单个任务.md) | GET | `/api/tasks/{id}` | 根据ID获取指定任务的详细信息 |
| [创建新任务](./创建新任务.md) | POST | `/api/tasks` | 创建一个新的待办任务 |
| [更新任务](./更新任务.md) | PUT/PATCH | `/api/tasks/{id}` | 更新指定任务的信息 |
| [删除任务](./删除任务.md) | DELETE | `/api/tasks/{id}` | 删除指定的任务 |
| [标记任务完成](./标记任务完成.md) | PATCH | `/api/tasks/{id}/complete` | 将指定任务标记为已完成 |
| [标记任务未完成](./标记任务未完成.md) | PATCH | `/api/tasks/{id}/pending` | 将已完成任务重新标记为未完成 |
| [获取当前提醒](./获取当前提醒.md) | GET | `/api/reminders` | 获取当前需要提醒的任务列表（未来30分钟内到期） |

## 通用响应格式

所有接口统一使用以下响应格式：

```javascript
{
  "success": boolean,    // 请求是否成功
  "data": object,        // 响应数据
  "message": string,     // 响应消息
  "error": {             // 错误信息（可选）
    "code": string,      // 错误码
    "message": string,   // 错误消息
    "details": string    // 错误详情
  },
  "timestamp": string    // 响应时间戳
}
```

## 数据类型

### TodoTaskResponse

任务对象的数据结构：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| id | integer(int64) | 任务ID |
| title | string | 任务标题 |
| description | string | 任务描述 |
| status | string | 任务状态 |
| statusDescription | string | 状态描述 |
| priority | string | 优先级 |
| priorityDescription | string | 优先级描述 |
| priorityColor | string | 优先级颜色 |
| deadline | string(date-time) | 截止时间 |
| createdAt | string(date-time) | 创建时间 |
| updatedAt | string(date-time) | 更新时间 |
| completedAt | string(date-time) | 完成时间 |
| overdue | boolean | 是否逾期 |
| remainingMinutes | integer(int64) | 剩余分钟数 |
| deadlineFormatted | string | 格式化的截止时间 |
| completedAtFormatted | string | 格式化的完成时间 |
