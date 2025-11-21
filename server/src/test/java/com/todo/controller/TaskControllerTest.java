package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.service.TaskService;
import com.todo.vo.TaskCreateRequest;
import com.todo.vo.TaskUpdateRequest;
import com.todo.vo.TaskVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 任务控制器单元测试
 */
@WebMvcTest(TaskController.class)
class TaskControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private TaskService taskService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testCreateTask() throws Exception {
        // 准备测试数据
        TaskCreateRequest request = new TaskCreateRequest();
        request.setTitle("测试任务");
        request.setDescription("测试描述");
        
        TaskVO taskVO = new TaskVO();
        taskVO.setId(1L);
        taskVO.setTitle("测试任务");
        
        when(taskService.createTask(any(TaskCreateRequest.class))).thenReturn(taskVO);
        
        // 执行测试
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.title").value("测试任务"));
    }
    
    @Test
    void testCreateTaskWithEmptyTitle() throws Exception {
        // 准备测试数据
        TaskCreateRequest request = new TaskCreateRequest();
        request.setTitle("");
        
        // 执行测试 - 应该返回验证错误
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400));
    }
    
    @Test
    void testGetTask() throws Exception {
        // 准备测试数据
        TaskVO taskVO = new TaskVO();
        taskVO.setId(1L);
        taskVO.setTitle("测试任务");
        
        when(taskService.getTaskById(1L)).thenReturn(taskVO);
        
        // 执行测试
        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("测试任务"));
    }
    
    @Test
    void testUpdateTask() throws Exception {
        // 准备测试数据
        TaskUpdateRequest request = new TaskUpdateRequest();
        request.setTitle("更新后的任务");
        
        TaskVO taskVO = new TaskVO();
        taskVO.setId(1L);
        taskVO.setTitle("更新后的任务");
        
        when(taskService.updateTask(any(Long.class), any(TaskUpdateRequest.class))).thenReturn(taskVO);
        
        // 执行测试
        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.title").value("更新后的任务"));
    }
    
    @Test
    void testDeleteTask() throws Exception {
        // 执行测试
        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}

