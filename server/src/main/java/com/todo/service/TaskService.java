package com.todo.service;

import com.todo.entity.TodoTask;
import com.todo.enums.Priority;
import com.todo.enums.SortType;
import com.todo.enums.TaskStatus;
import com.todo.repository.TodoTaskRepository;
import com.todo.vo.PageResult;
import com.todo.vo.TaskCreateRequest;
import com.todo.vo.TaskUpdateRequest;
import com.todo.vo.TaskVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 任务管理服务
 */
@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TodoTaskRepository taskRepository;
    
    /**
     * 创建任务
     */
    @Transactional
    public TaskVO createTask(TaskCreateRequest request) {
        TodoTask task = new TodoTask();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueTime(request.getDueTime());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM.getCode());
        task.setStatus(TaskStatus.UNFINISHED.getCode());
        
        TodoTask saved = taskRepository.save(task);
        return convertToVO(saved);
    }
    
    /**
     * 更新任务
     */
    @Transactional
    public TaskVO updateTask(Long id, TaskUpdateRequest request) {
        TodoTask task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("任务不存在"));
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueTime(request.getDueTime());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        
        TodoTask updated = taskRepository.save(task);
        return convertToVO(updated);
    }
    
    /**
     * 删除任务
     */
    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("任务不存在");
        }
        taskRepository.deleteById(id);
    }
    
    /**
     * 获取任务详情
     */
    public TaskVO getTaskById(Long id) {
        TodoTask task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("任务不存在"));
        return convertToVO(task);
    }
    
    /**
     * 查询任务列表（支持筛选、排序、分页）
     */
    public PageResult<TaskVO> getTasks(Integer status, String sortType, Integer page, Integer size) {
        // 默认值处理
        if (page == null || page < 1) page = 1;
        if (size == null || size < 1) size = 20;
        SortType sort = SortType.fromCode(sortType);
        
        // 构建排序
        Sort sortObj = buildSort(sort);
        Pageable pageable = PageRequest.of(page - 1, size, sortObj);
        
        // 查询
        Page<TodoTask> taskPage;
        if (status != null) {
            taskPage = taskRepository.findByStatus(status, pageable);
        } else {
            taskPage = taskRepository.findAllByStatus(null, pageable);
        }
        
        // 转换为VO
        List<TaskVO> voList = taskPage.getContent().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
        
        return new PageResult<>(voList, taskPage.getTotalElements(), page, size);
    }
    
    /**
     * 标记任务完成/未完成
     */
    @Transactional
    public TaskVO updateTaskStatus(Long id, Integer status) {
        TodoTask task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("任务不存在"));
        
        task.setStatus(status);
        if (status.equals(TaskStatus.FINISHED.getCode())) {
            task.setFinishTime(LocalDateTime.now());
        } else {
            task.setFinishTime(null);
        }
        
        TodoTask updated = taskRepository.save(task);
        return convertToVO(updated);
    }
    
    /**
     * 构建排序对象
     */
    private Sort buildSort(SortType sortType) {
        switch (sortType) {
            case LATEST:
                return Sort.by(Sort.Direction.DESC, "createTime");
            case DUE_TIME:
                // 无截止时间的排在最后
                return Sort.by(Sort.Direction.ASC, "dueTime").and(Sort.by(Sort.Direction.DESC, "createTime"));
            case PRIORITY:
                return Sort.by(Sort.Direction.ASC, "priority").and(Sort.by(Sort.Direction.DESC, "createTime"));
            default:
                return Sort.by(Sort.Direction.DESC, "createTime");
        }
    }
    
    /**
     * 实体转VO
     */
    private TaskVO convertToVO(TodoTask task) {
        TaskVO vo = new TaskVO();
        vo.setId(task.getId());
        vo.setTitle(task.getTitle());
        vo.setDescription(task.getDescription());
        vo.setStatus(task.getStatus());
        TaskStatus status = TaskStatus.fromCode(task.getStatus());
        vo.setStatusDesc(status != null ? status.getDesc() : "未知");
        vo.setPriority(task.getPriority());
        Priority priority = Priority.fromCode(task.getPriority());
        vo.setPriorityDesc(priority != null ? priority.getDesc() : "未知");
        vo.setDueTime(task.getDueTime());
        vo.setCreateTime(task.getCreateTime());
        vo.setUpdateTime(task.getUpdateTime());
        vo.setFinishTime(task.getFinishTime());
        
        // 判断是否逾期（未完成且有截止时间且已过期）
        if (task.getStatus().equals(TaskStatus.UNFINISHED.getCode()) 
                && task.getDueTime() != null 
                && task.getDueTime().isBefore(LocalDateTime.now())) {
            vo.setOverdue(true);
        } else {
            vo.setOverdue(false);
        }
        
        return vo;
    }
}

