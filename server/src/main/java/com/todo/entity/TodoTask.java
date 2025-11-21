package com.todo.entity;

import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 待办任务实体类
 */
@Entity
@Table(name = "todo_task")
@Data
public class TodoTask {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private Integer status; // 0-未完成，1-已完成
    
    @Column(nullable = false)
    private Integer priority; // 1-高，2-中，3-低
    
    @Column(name = "due_time")
    private LocalDateTime dueTime;
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime;
    
    @Column(name = "finish_time")
    private LocalDateTime finishTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
        if (status == null) {
            status = TaskStatus.UNFINISHED.getCode();
        }
        if (priority == null) {
            priority = Priority.MEDIUM.getCode();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
}

