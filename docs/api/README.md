# API接口文档索引

本文档目录包含所有API接口的详细说明文档，方便前端开发人员查阅和调用。

## 基础信息

- **基础URL**: `http://localhost:8080`
- **API前缀**: `/api`
- **响应格式**: JSON
- **字符编码**: UTF-8

## 统一响应格式

所有接口返回统一的JSON格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 状态码，200表示成功，其他表示失败 |
| message | String | 响应消息 |
| data | Object/Array | 响应数据，根据接口不同而变化 |

## 接口分类

### 1. 任务管理接口

- [POST /api/tasks - 新增任务](./01-新增任务.md)
- [GET /api/tasks - 查询任务列表](./02-查询任务列表.md)
- [GET /api/tasks/{id} - 获取任务详情](./03-获取任务详情.md)
- [PUT /api/tasks/{id} - 编辑任务](./04-编辑任务.md)
- [DELETE /api/tasks/{id} - 删除任务](./05-删除任务.md)
- [PATCH /api/tasks/{id}/status - 标记任务状态](./06-标记任务状态.md)

### 2. 数据统计接口

- [GET /api/stats/completion - 完成率统计](./07-完成率统计.md)
- [GET /api/stats/trend - 任务数量趋势](./08-任务数量趋势.md)
- [GET /api/stats/distribution - 状态分布](./09-状态分布.md)

### 3. 提醒功能接口

- [GET /api/reminders - 获取待提醒任务](./10-获取待提醒任务.md)
- [GET /api/settings/reminder - 获取提醒设置](./11-获取提醒设置.md)
- [POST /api/settings/reminder - 设置提醒开关](./12-设置提醒开关.md)

## 通用枚举值

### 任务状态 (status)

| 值 | 说明 |
|----|------|
| 0 | 未完成 |
| 1 | 已完成 |

### 优先级 (priority)

| 值 | 说明 |
|----|------|
| 1 | 高 |
| 2 | 中 |
| 3 | 低 |

### 排序类型 (sortType)

| 值 | 说明 |
|----|------|
| latest | 最新添加（默认） |
| dueTime | 即将截止 |
| priority | 优先级 |

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 参数验证失败 |
| 500 | 服务器内部错误 |

## 在线文档

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI文档**: http://localhost:8080/api-docs

## 注意事项

1. 所有时间字段使用ISO 8601格式：`YYYY-MM-DDTHH:mm:ss`
2. 分页参数：page从1开始，size默认为20
3. 所有接口均支持跨域请求（CORS）
4. 请求头需设置：`Content-Type: application/json`

