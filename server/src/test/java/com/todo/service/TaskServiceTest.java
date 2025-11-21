package com.todo.service;

import com.todo.entity.TodoTask;
import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import com.todo.repository.TodoTaskRepository;
import com.todo.vo.TaskCreateRequest;
import com.todo.vo.TaskUpdateRequest;
import com.todo.vo.TaskVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 任务服务单元测试
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    
    @Mock
    private TodoTaskRepository taskRepository;
    
    @InjectMocks
    private TaskService taskService;
    
    private TodoTask testTask;
    
    @BeforeEach
    void setUp() {
        testTask = new TodoTask();
        testTask.setId(1L);
        testTask.setTitle("测试任务");
        testTask.setDescription("测试描述");
        testTask.setStatus(TaskStatus.UNFINISHED.getCode());
        testTask.setPriority(Priority.MEDIUM.getCode());
        testTask.setCreateTime(LocalDateTime.now());
        testTask.setUpdateTime(LocalDateTime.now());
    }
    
    @Test
    void testCreateTask() {
        // 准备测试数据
        TaskCreateRequest request = new TaskCreateRequest();
        request.setTitle("新任务");
        request.setDescription("新任务描述");
        request.setPriority(Priority.HIGH.getCode());
        
        TodoTask savedTask = new TodoTask();
        savedTask.setId(1L);
        savedTask.setTitle("新任务");
        savedTask.setDescription("新任务描述");
        savedTask.setStatus(TaskStatus.UNFINISHED.getCode());
        savedTask.setPriority(Priority.HIGH.getCode());
        savedTask.setCreateTime(LocalDateTime.now());
        
        when(taskRepository.save(any(TodoTask.class))).thenReturn(savedTask);
        
        // 执行测试
        TaskVO result = taskService.createTask(request);
        
        // 验证结果
        assertNotNull(result);
        assertEquals("新任务", result.getTitle());
        assertEquals(Priority.HIGH.getCode(), result.getPriority());
        assertEquals(TaskStatus.UNFINISHED.getCode(), result.getStatus());
        
        verify(taskRepository, times(1)).save(any(TodoTask.class));
    }
    
    @Test
    void testUpdateTask() {
        // 准备测试数据
        TaskUpdateRequest request = new TaskUpdateRequest();
        request.setTitle("更新后的任务");
        request.setDescription("更新后的描述");
        request.setPriority(Priority.LOW.getCode());
        
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(TodoTask.class))).thenReturn(testTask);
        
        // 执行测试
        TaskVO result = taskService.updateTask(1L, request);
        
        // 验证结果
        assertNotNull(result);
        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(TodoTask.class));
    }
    
    @Test
    void testUpdateTaskNotFound() {
        // 准备测试数据
        TaskUpdateRequest request = new TaskUpdateRequest();
        request.setTitle("更新后的任务");
        
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());
        
        // 执行测试并验证异常
        assertThrows(RuntimeException.class, () -> {
            taskService.updateTask(1L, request);
        });
        
        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, never()).save(any(TodoTask.class));
    }
    
    @Test
    void testDeleteTask() {
        // 准备测试数据
        when(taskRepository.existsById(1L)).thenReturn(true);
        
        // 执行测试
        taskService.deleteTask(1L);
        
        // 验证结果
        verify(taskRepository, times(1)).existsById(1L);
        verify(taskRepository, times(1)).deleteById(1L);
    }
    
    @Test
    void testGetTaskById() {
        // 准备测试数据
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        
        // 执行测试
        TaskVO result = taskService.getTaskById(1L);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("测试任务", result.getTitle());
        
        verify(taskRepository, times(1)).findById(1L);
    }
    
    @Test
    void testUpdateTaskStatus() {
        // 准备测试数据
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(TodoTask.class))).thenReturn(testTask);
        
        // 执行测试 - 标记为完成
        TaskVO result = taskService.updateTaskStatus(1L, TaskStatus.FINISHED.getCode());
        
        // 验证结果
        assertNotNull(result);
        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(TodoTask.class));
    }
    
    @Test
    void testGetTasks() {
        // 准备测试数据
        List<TodoTask> tasks = Arrays.asList(testTask);
        Page<TodoTask> page = new PageImpl<>(tasks, PageRequest.of(0, 20), 1);
        
        when(taskRepository.findAllByStatus(eq(null), any(Pageable.class))).thenReturn(page);
        
        // 执行测试
        var result = taskService.getTasks(null, "latest", 1, 20);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.getData().size());
        assertEquals(1L, result.getTotal());
        
        verify(taskRepository, times(1)).findAllByStatus(eq(null), any(Pageable.class));
    }
}

