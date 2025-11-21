package com.todo.vo;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 任务响应对象
 */
@Data
public class TaskVO {
    private Long id;
    private String title;
    private String description;
    private Integer status;
    private String statusDesc;
    private Integer priority;
    private String priorityDesc;
    private LocalDateTime dueTime;
    private Boolean overdue; // 是否逾期
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private LocalDateTime finishTime;
}

