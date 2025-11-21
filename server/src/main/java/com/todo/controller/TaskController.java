package com.todo.controller;

import com.todo.service.TaskService;
import com.todo.vo.ApiResponse;
import com.todo.vo.PageResult;
import com.todo.vo.TaskCreateRequest;
import com.todo.vo.TaskUpdateRequest;
import com.todo.vo.TaskVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 任务管理API控制器
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "任务管理", description = "任务的增删改查和状态管理")
public class TaskController {
    
    private final TaskService taskService;
    
    @PostMapping
    @Operation(summary = "新增任务", description = "创建新的待办任务")
    public ApiResponse<TaskVO> createTask(@Valid @RequestBody TaskCreateRequest request) {
        try {
            TaskVO task = taskService.createTask(request);
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "编辑任务", description = "更新任务信息")
    public ApiResponse<TaskVO> updateTask(@PathVariable Long id, 
                                          @Valid @RequestBody TaskUpdateRequest request) {
        try {
            TaskVO task = taskService.updateTask(id, request);
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "删除任务", description = "删除指定任务")
    public ApiResponse<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "获取任务详情", description = "根据ID获取任务详细信息")
    public ApiResponse<TaskVO> getTask(@PathVariable Long id) {
        try {
            TaskVO task = taskService.getTaskById(id);
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping
    @Operation(summary = "查询任务列表", description = "支持按状态筛选、排序和分页")
    public ApiResponse<PageResult<TaskVO>> getTasks(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false, defaultValue = "latest") String sortType,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer size) {
        try {
            PageResult<TaskVO> result = taskService.getTasks(status, sortType, page, size);
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "标记任务状态", description = "标记任务为完成或未完成")
    public ApiResponse<TaskVO> updateTaskStatus(@PathVariable Long id, 
                                                @RequestParam Integer status) {
        try {
            TaskVO task = taskService.updateTaskStatus(id, status);
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}

