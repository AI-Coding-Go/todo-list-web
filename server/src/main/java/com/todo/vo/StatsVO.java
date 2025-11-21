package com.todo.vo;

import lombok.Data;
import java.util.List;
import java.util.Map;

/**
 * 统计数据响应对象
 */
@Data
public class StatsVO {
    // 完成率统计
    private Double completionRate; // 总体完成率
    private Map<String, Double> completionRateByPriority; // 按优先级完成率
    
    // 趋势数据
    private List<TrendData> trendData; // 每日新增和完成数
    
    // 状态分布
    private Long unfinishedCount;
    private Long finishedCount;
    
    @Data
    public static class TrendData {
        private String date;
        private Long createdCount;
        private Long finishedCount;
    }
}

