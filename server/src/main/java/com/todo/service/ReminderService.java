package com.todo.service;

import com.todo.entity.TodoTask;
import com.todo.repository.TodoTaskRepository;
import com.todo.vo.ReminderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 提醒服务
 */
@Service
@RequiredArgsConstructor
public class ReminderService {
    
    private final TodoTaskRepository taskRepository;
    private final StringRedisTemplate redisTemplate;
    
    private static final String REMINDER_LOCK_PREFIX = "reminder:lock:";
    private static final int LOCK_EXPIRE_SECONDS = 300; // 5分钟
    
    /**
     * 扫描需要提醒的任务（定时任务调用）
     */
    public List<ReminderVO> scanReminders() {
        List<ReminderVO> reminders = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        // 1. 截止时间前30分钟提醒（查询截止时间在30分钟后的任务，允许1分钟误差）
        LocalDateTime targetTime = now.plusMinutes(30);
        LocalDateTime before30MinStart = targetTime.minusMinutes(1);
        LocalDateTime before30MinEnd = targetTime.plusMinutes(1);
        List<TodoTask> tasksBefore30Min = taskRepository.findTasksToRemindBefore30Min(
                before30MinStart, before30MinEnd);
        
        for (TodoTask task : tasksBefore30Min) {
            String lockKey = REMINDER_LOCK_PREFIX + task.getId() + ":before30min";
            if (tryLock(lockKey)) {
                reminders.add(buildReminderVO(task, "before30min", 
                        "任务将在30分钟后截止"));
            }
        }
        
        // 2. 截止时间整点提醒（查询截止时间在当前时间前后1分钟内的任务）
        LocalDateTime dueStart = now.minusMinutes(1);
        LocalDateTime dueEnd = now.plusMinutes(1);
        List<TodoTask> tasksDueNow = taskRepository.findTasksToRemindBefore30Min(dueStart, dueEnd);
        for (TodoTask task : tasksDueNow) {
            String lockKey = REMINDER_LOCK_PREFIX + task.getId() + ":due";
            if (tryLock(lockKey)) {
                reminders.add(buildReminderVO(task, "due", "任务即将截止"));
            }
        }
        
        // 3. 逾期提醒（每24小时提醒一次，最多3次）
        List<TodoTask> overdueTasks = taskRepository.findOverdueTasks(now);
        for (TodoTask task : overdueTasks) {
            // 检查是否已提醒超过3次
            String countKey = REMINDER_LOCK_PREFIX + task.getId() + ":overdue:count";
            String countStr = redisTemplate.opsForValue().get(countKey);
            int remindCount = countStr != null ? Integer.parseInt(countStr) : 0;
            
            if (remindCount < 3) {
                // 检查上次提醒时间，确保间隔24小时
                String lastRemindKey = REMINDER_LOCK_PREFIX + task.getId() + ":overdue:last";
                String lastRemindStr = redisTemplate.opsForValue().get(lastRemindKey);
                
                boolean shouldRemind = false;
                if (lastRemindStr == null) {
                    // 首次逾期提醒
                    shouldRemind = true;
                } else {
                    LocalDateTime lastRemind = LocalDateTime.parse(lastRemindStr);
                    if (now.isAfter(lastRemind.plusHours(24))) {
                        shouldRemind = true;
                    }
                }
                
                if (shouldRemind) {
                    String lockKey = REMINDER_LOCK_PREFIX + task.getId() + ":overdue:" + remindCount;
                    if (tryLock(lockKey)) {
                        reminders.add(buildReminderVO(task, "overdue", "任务已逾期"));
                        // 更新提醒次数和最后提醒时间
                        redisTemplate.opsForValue().set(countKey, String.valueOf(remindCount + 1), 
                                LOCK_EXPIRE_SECONDS * 10, TimeUnit.SECONDS);
                        redisTemplate.opsForValue().set(lastRemindKey, now.toString(), 
                                LOCK_EXPIRE_SECONDS * 10, TimeUnit.SECONDS);
                    }
                }
            }
        }
        
        return reminders;
    }
    
    /**
     * 获取待提醒任务列表（长轮询接口）
     */
    public List<ReminderVO> getPendingReminders() {
        // 从Redis中获取待提醒的任务（由定时任务扫描后存入）
        // 这里简化处理，直接调用扫描方法
        return scanReminders();
    }
    
    /**
     * 尝试获取Redis锁
     */
    private boolean tryLock(String key) {
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "1", 
                LOCK_EXPIRE_SECONDS, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }
    
    /**
     * 构建提醒VO
     */
    private ReminderVO buildReminderVO(TodoTask task, String reminderType, String message) {
        ReminderVO vo = new ReminderVO();
        vo.setTaskId(task.getId());
        vo.setTitle(task.getTitle());
        vo.setDueTime(task.getDueTime());
        vo.setReminderType(reminderType);
        vo.setMessage(message);
        return vo;
    }
}

