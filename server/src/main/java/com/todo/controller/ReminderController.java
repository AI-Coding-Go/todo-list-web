package com.todo.controller;

import com.todo.service.ReminderService;
import com.todo.service.SettingService;
import com.todo.vo.ApiResponse;
import com.todo.vo.ReminderVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 提醒API控制器
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "待办提醒", description = "任务提醒相关接口")
public class ReminderController {
    
    private final ReminderService reminderService;
    private final SettingService settingService;
    
    @GetMapping("/reminders")
    @Operation(summary = "获取待提醒任务", description = "长轮询接口，返回需要提醒的任务列表")
    public ApiResponse<List<ReminderVO>> getReminders() {
        try {
            // 检查提醒开关
            if (!settingService.getReminderEnabled()) {
                return ApiResponse.success(List.of());
            }
            
            List<ReminderVO> reminders = reminderService.getPendingReminders();
            return ApiResponse.success(reminders);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/settings/reminder")
    @Operation(summary = "获取提醒设置", description = "获取全局提醒开关状态")
    public ApiResponse<Boolean> getReminderSetting() {
        try {
            Boolean enabled = settingService.getReminderEnabled();
            return ApiResponse.success(enabled);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/settings/reminder")
    @Operation(summary = "设置提醒开关", description = "开启或关闭全局提醒功能")
    public ApiResponse<Void> setReminderSetting(@RequestParam Boolean enabled) {
        try {
            settingService.setReminderEnabled(enabled);
            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}

