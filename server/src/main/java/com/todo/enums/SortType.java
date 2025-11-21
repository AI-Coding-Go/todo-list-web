package com.todo.enums;

import lombok.Getter;

/**
 * 排序类型枚举
 */
@Getter
public enum SortType {
    LATEST("latest", "最新添加"),
    DUE_TIME("dueTime", "即将截止"),
    PRIORITY("priority", "优先级");
    
    private final String code;
    private final String desc;
    
    SortType(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    
    public static SortType fromCode(String code) {
        for (SortType type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return LATEST; // 默认最新添加
    }
}

