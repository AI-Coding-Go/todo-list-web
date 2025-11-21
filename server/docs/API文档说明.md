# API接口文档说明

## 文档位置

所有API接口文档位于 `docs/api/` 目录下，每个接口都有独立的Markdown文档。

## 文档结构

### 索引文档
- `docs/api/README.md` - API接口文档索引，包含所有接口的快速导航

### 接口文档列表

#### 任务管理接口
1. `01-新增任务.md` - POST /api/tasks
2. `02-查询任务列表.md` - GET /api/tasks
3. `03-获取任务详情.md` - GET /api/tasks/{id}
4. `04-编辑任务.md` - PUT /api/tasks/{id}
5. `05-删除任务.md` - DELETE /api/tasks/{id}
6. `06-标记任务状态.md` - PATCH /api/tasks/{id}/status

#### 数据统计接口
7. `07-完成率统计.md` - GET /api/stats/completion
8. `08-任务数量趋势.md` - GET /api/stats/trend
9. `09-状态分布.md` - GET /api/stats/distribution

#### 提醒功能接口
10. `10-获取待提醒任务.md` - GET /api/reminders
11. `11-获取提醒设置.md` - GET /api/settings/reminder
12. `12-设置提醒开关.md` - POST /api/settings/reminder

## 文档内容

每个接口文档包含：
- 接口基本信息（URL、方法、描述）
- 请求参数说明（Path参数、Query参数、Body参数）
- 请求示例（curl命令和JavaScript代码）
- 响应示例（成功和失败情况）
- 响应字段说明
- 业务规则
- 注意事项
- 使用场景（部分接口）

## 使用方式

1. **快速查找**: 查看 `docs/api/README.md` 索引文档
2. **详细查阅**: 打开对应的接口文档文件
3. **在线文档**: 访问 http://localhost:8080/swagger-ui.html

## 文档特点

- ✅ 每个接口独立文档，便于查阅
- ✅ 包含完整的请求/响应示例
- ✅ 提供多种语言的调用示例（curl、JavaScript）
- ✅ 详细的字段说明和业务规则
- ✅ 前端开发友好的格式

## 更新说明

文档基于实际代码实现生成，如接口有变更，请同步更新对应文档。

