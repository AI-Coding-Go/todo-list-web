package com.todo.service;

import com.todo.enums.Priority;
import com.todo.repository.TodoTaskRepository;
import com.todo.vo.StatsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 统计数据服务
 */
@Service
@RequiredArgsConstructor
public class StatsService {
    
    private final TodoTaskRepository taskRepository;
    
    /**
     * 获取完成率统计
     */
    public StatsVO getCompletionRate(int days) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        
        // 总任务数
        Long totalCount = taskRepository.countByCreateTimeAfter(startTime);
        // 已完成任务数
        Long finishedCount = taskRepository.countFinishedByFinishTimeAfter(startTime);
        
        // 总体完成率
        Double completionRate = totalCount > 0 ? (double) finishedCount / totalCount * 100 : 0.0;
        
        // 按优先级统计
        List<Object[]> totalByPriority = taskRepository.countByPriorityAndCreateTimeAfter(startTime);
        List<Object[]> finishedByPriority = taskRepository.countFinishedByPriorityAndFinishTimeAfter(startTime);
        
        Map<String, Double> completionRateByPriority = new HashMap<>();
        Map<Integer, Long> totalMap = totalByPriority.stream()
                .collect(Collectors.toMap(
                    arr -> (Integer) arr[0],
                    arr -> (Long) arr[1]
                ));
        Map<Integer, Long> finishedMap = finishedByPriority.stream()
                .collect(Collectors.toMap(
                    arr -> (Integer) arr[0],
                    arr -> (Long) arr[1]
                ));
        
        for (Priority priority : Priority.values()) {
            Long total = totalMap.getOrDefault(priority.getCode(), 0L);
            Long finished = finishedMap.getOrDefault(priority.getCode(), 0L);
            Double rate = total > 0 ? (double) finished / total * 100 : 0.0;
            completionRateByPriority.put(priority.getDesc(), rate);
        }
        
        StatsVO stats = new StatsVO();
        stats.setCompletionRate(completionRate);
        stats.setCompletionRateByPriority(completionRateByPriority);
        return stats;
    }
    
    /**
     * 获取任务数量趋势
     */
    public StatsVO getTrend(int days) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        
        // 每日新增任务数
        List<Object[]> dailyCreated = taskRepository.countDailyCreated(startTime);
        // 每日完成任务数
        List<Object[]> dailyFinished = taskRepository.countDailyFinished(startTime);
        
        // 构建日期到数量的映射
        Map<String, Long> createdMap = dailyCreated.stream()
                .collect(Collectors.toMap(
                    arr -> arr[0].toString(),
                    arr -> (Long) arr[1]
                ));
        Map<String, Long> finishedMap = dailyFinished.stream()
                .collect(Collectors.toMap(
                    arr -> arr[0].toString(),
                    arr -> (Long) arr[1]
                ));
        
        // 生成日期范围
        List<StatsVO.TrendData> trendDataList = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dateStr = date.format(formatter);
            
            StatsVO.TrendData data = new StatsVO.TrendData();
            data.setDate(dateStr);
            data.setCreatedCount(createdMap.getOrDefault(dateStr, 0L));
            data.setFinishedCount(finishedMap.getOrDefault(dateStr, 0L));
            trendDataList.add(data);
        }
        
        StatsVO stats = new StatsVO();
        stats.setTrendData(trendDataList);
        return stats;
    }
    
    /**
     * 获取状态分布
     */
    public StatsVO getDistribution() {
        // 统计所有任务的状态分布
        List<com.todo.entity.TodoTask> allTasks = taskRepository.findAll();
        
        Long unfinishedCount = allTasks.stream()
                .filter(t -> t.getStatus() == 0)
                .count();
        Long finishedCount = allTasks.stream()
                .filter(t -> t.getStatus() == 1)
                .count();
        
        StatsVO stats = new StatsVO();
        stats.setUnfinishedCount(unfinishedCount);
        stats.setFinishedCount(finishedCount);
        return stats;
    }
}

