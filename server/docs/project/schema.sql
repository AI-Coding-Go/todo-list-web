-- 个人待办清单数据库初始化脚本

-- 删除已存在的数据库（如果存在）
DROP DATABASE IF EXISTS todo_db;

-- 创建数据库
CREATE DATABASE todo_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE todo_db;

-- 任务表
CREATE TABLE todo_task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键，自增',
    title VARCHAR(50) NOT NULL COMMENT '任务标题，必填，限长50',
    description VARCHAR(500) COMMENT '任务描述，选填，限长500',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '任务状态：0-未完成，1-已完成',
    priority TINYINT NOT NULL DEFAULT 2 COMMENT '优先级：1-高，2-中，3-低',
    due_time DATETIME COMMENT '截止时间，可空',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    finish_time DATETIME COMMENT '完成时间，已完成时记录',
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_time (due_time),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办任务表';

