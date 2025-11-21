package com.todo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

/**
 * 设置服务
 */
@Service
@RequiredArgsConstructor
public class SettingService {
    
    private final StringRedisTemplate redisTemplate;
    private static final String REMINDER_ENABLED_KEY = "setting:reminder:enabled";
    
    /**
     * 获取提醒开关状态
     */
    public Boolean getReminderEnabled() {
        String value = redisTemplate.opsForValue().get(REMINDER_ENABLED_KEY);
        if (value == null) {
            // 默认开启
            setReminderEnabled(true);
            return true;
        }
        return Boolean.parseBoolean(value);
    }
    
    /**
     * 设置提醒开关
     */
    public void setReminderEnabled(Boolean enabled) {
        redisTemplate.opsForValue().set(REMINDER_ENABLED_KEY, String.valueOf(enabled), 
                365, TimeUnit.DAYS);
    }
}

