package com.todo.controller;

import com.todo.service.StatsService;
import com.todo.vo.ApiResponse;
import com.todo.vo.StatsVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 统计数据API控制器
 */
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "数据统计", description = "任务完成率、趋势和分布统计")
public class StatsController {
    
    private final StatsService statsService;
    
    @GetMapping("/completion")
    @Operation(summary = "完成率统计", description = "获取任务完成率，支持按优先级统计")
    public ApiResponse<StatsVO> getCompletionRate(
            @RequestParam(required = false, defaultValue = "7") Integer range) {
        try {
            StatsVO stats = statsService.getCompletionRate(range);
            return ApiResponse.success(stats);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/trend")
    @Operation(summary = "任务数量趋势", description = "获取每日新增和完成任务数趋势")
    public ApiResponse<StatsVO> getTrend(
            @RequestParam(required = false, defaultValue = "7") Integer range) {
        try {
            StatsVO stats = statsService.getTrend(range);
            return ApiResponse.success(stats);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/distribution")
    @Operation(summary = "状态分布", description = "获取任务状态分布统计")
    public ApiResponse<StatsVO> getDistribution() {
        try {
            StatsVO stats = statsService.getDistribution();
            return ApiResponse.success(stats);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}

