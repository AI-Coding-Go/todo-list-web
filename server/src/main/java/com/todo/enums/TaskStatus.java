package com.todo.enums;

import lombok.Getter;

/**
 * 任务状态枚举
 */
@Getter
public enum TaskStatus {
    UNFINISHED(0, "未完成"),
    FINISHED(1, "已完成");
    
    private final Integer code;
    private final String desc;
    
    TaskStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    
    public static TaskStatus fromCode(Integer code) {
        for (TaskStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}

