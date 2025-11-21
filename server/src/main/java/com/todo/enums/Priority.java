package com.todo.enums;

import lombok.Getter;

/**
 * 任务优先级枚举
 */
@Getter
public enum Priority {
    HIGH(1, "高"),
    MEDIUM(2, "中"),
    LOW(3, "低");
    
    private final Integer code;
    private final String desc;
    
    Priority(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    
    public static Priority fromCode(Integer code) {
        for (Priority priority : values()) {
            if (priority.getCode().equals(code)) {
                return priority;
            }
        }
        return null;
    }
}

