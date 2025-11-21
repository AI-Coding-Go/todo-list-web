package com.todo.vo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 创建任务请求对象
 */
@Data
public class TaskCreateRequest {
    
    @NotBlank(message = "任务标题不能为空")
    @Size(max = 50, message = "任务标题不能超过50个字符")
    private String title;
    
    @Size(max = 500, message = "任务描述不能超过500个字符")
    private String description;
    
    private LocalDateTime dueTime;
    
    private Integer priority; // 1-高，2-中，3-低，默认2
}

