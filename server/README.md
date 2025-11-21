# 个人待办清单后端服务

## 项目简介

个人待办清单后端服务，基于Spring Boot开发，提供RESTful API接口，支持任务管理、数据统计和待办提醒功能。

## 技术栈

- Spring Boot 3.1.5
- Java 17
- MySQL 8.0+
- Redis
- Spring Data JPA
- Swagger/OpenAPI 3

## 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+
- Redis 6.0+

## 快速开始

### 1. 数据库初始化

执行 `src/main/resources/db/schema.sql` 创建数据库和表结构：

```bash
mysql -u root -p < src/main/resources/db/schema.sql
```

### 2. 配置数据库连接

编辑 `src/main/resources/application.yml`，修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/todo_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
  data:
    redis:
      host: localhost
      port: 6379
      password: your_redis_password
```

### 3. 启动服务

#### 方式一：使用Maven命令

```bash
mvn spring-boot:run
```

#### 方式二：使用IDE

直接运行 `TodoApplication.java` 主类

### 4. 访问API文档

启动成功后，访问 Swagger UI：
- http://localhost:8080/swagger-ui.html

API文档地址：
- http://localhost:8080/api-docs

## API接口说明

### 任务管理

- `POST /api/tasks` - 新增任务
- `GET /api/tasks` - 查询任务列表（支持状态筛选、排序、分页）
- `GET /api/tasks/{id}` - 获取任务详情
- `PUT /api/tasks/{id}` - 编辑任务
- `DELETE /api/tasks/{id}` - 删除任务
- `PATCH /api/tasks/{id}/status` - 标记任务状态

### 数据统计

- `GET /api/stats/completion?range=7` - 完成率统计
- `GET /api/stats/trend?range=7` - 任务数量趋势
- `GET /api/stats/distribution` - 状态分布

### 待办提醒

- `GET /api/reminders` - 获取待提醒任务（长轮询接口）
- `GET /api/settings/reminder` - 获取提醒设置
- `POST /api/settings/reminder?enabled=true` - 设置提醒开关

## 项目结构

```
src/main/java/com/todo/
├── config/          # 配置类（Redis、Swagger、异常处理）
├── controller/      # API控制器
├── entity/          # 实体类
├── enums/           # 枚举类
├── repository/      # 数据访问层
├── service/         # 业务逻辑层
├── task/            # 定时任务
└── vo/              # 视图对象/数据传输对象
```

## 运行测试

```bash
mvn test
```

## 注意事项

1. 本项目为单用户个人版，无需用户注册、登录、鉴权
2. 提醒功能采用长轮询方式，前端需定时调用 `/api/reminders` 接口
3. 定时任务每分钟扫描一次需要提醒的任务
4. 所有API返回统一JSON格式：`{code, message, data}`

## 开发说明

- 代码遵循分层架构：Controller -> Service -> Repository
- 单文件不超过200行，超过需拆分
- 关键业务逻辑添加中文注释
- 使用Lombok简化代码

