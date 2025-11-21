package com.todo.vo;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 提醒响应对象
 */
@Data
public class ReminderVO {
    private Long taskId;
    private String title;
    private LocalDateTime dueTime;
    private String reminderType; // "before30min", "due", "overdue"
    private String message;
}

