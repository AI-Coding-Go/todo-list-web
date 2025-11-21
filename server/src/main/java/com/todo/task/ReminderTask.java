package com.todo.task;

import com.todo.service.ReminderService;
import com.todo.service.SettingService;
import com.todo.vo.ReminderVO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 提醒定时任务
 * 定时扫描需要提醒的任务，并将提醒信息存入Redis供前端轮询获取
 */
@Component
@RequiredArgsConstructor
public class ReminderTask {
    
    private static final Logger log = LoggerFactory.getLogger(ReminderTask.class);
    
    private final ReminderService reminderService;
    private final SettingService settingService;
    private final StringRedisTemplate redisTemplate;
    
    private static final String REMINDER_QUEUE_KEY = "reminder:queue";
    private static final int QUEUE_EXPIRE_SECONDS = 300; // 5分钟过期
    
    /**
     * 每分钟扫描一次需要提醒的任务
     */
    @Scheduled(cron = "0 * * * * ?")
    public void scanReminders() {
        try {
            // 检查提醒开关
            if (!settingService.getReminderEnabled()) {
                return;
            }
            
            // 扫描需要提醒的任务
            List<ReminderVO> reminders = reminderService.scanReminders();
            
            if (!reminders.isEmpty()) {
                log.info("扫描到 {} 个待提醒任务", reminders.size());
                // 将提醒信息存入Redis队列（简化处理，实际可以更复杂）
                // 这里简化：每次扫描后，前端轮询时会直接调用scanReminders方法
                // 如果需要队列机制，可以使用Redis List存储
            }
        } catch (Exception e) {
            log.error("扫描提醒任务失败", e);
        }
    }
}

