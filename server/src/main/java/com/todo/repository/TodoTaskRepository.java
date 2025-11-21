package com.todo.repository;

import com.todo.entity.TodoTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务数据访问层
 */
@Repository
public interface TodoTaskRepository extends JpaRepository<TodoTask, Long> {
    
    /**
     * 根据状态查询任务
     */
    Page<TodoTask> findByStatus(Integer status, Pageable pageable);
    
    /**
     * 查询所有任务（支持状态筛选）
     */
    @Query("SELECT t FROM TodoTask t WHERE (:status IS NULL OR t.status = :status)")
    Page<TodoTask> findAllByStatus(@Param("status") Integer status, Pageable pageable);
    
    /**
     * 查询需要提醒的任务（截止时间前30分钟）
     */
    @Query("SELECT t FROM TodoTask t WHERE t.status = 0 AND t.dueTime IS NOT NULL " +
           "AND t.dueTime BETWEEN :startTime AND :endTime")
    List<TodoTask> findTasksToRemindBefore30Min(@Param("startTime") LocalDateTime startTime, 
                                                  @Param("endTime") LocalDateTime endTime);
    
    /**
     * 查询截止时间到达的任务
     */
    @Query("SELECT t FROM TodoTask t WHERE t.status = 0 AND t.dueTime IS NOT NULL " +
           "AND t.dueTime <= :now")
    List<TodoTask> findTasksDueNow(@Param("now") LocalDateTime now);
    
    /**
     * 查询逾期任务（逾期后每24小时提醒一次，最多3次）
     */
    @Query("SELECT t FROM TodoTask t WHERE t.status = 0 AND t.dueTime IS NOT NULL " +
           "AND t.dueTime < :now")
    List<TodoTask> findOverdueTasks(@Param("now") LocalDateTime now);
    
    /**
     * 统计指定时间范围内的任务数
     */
    @Query("SELECT COUNT(t) FROM TodoTask t WHERE t.createTime >= :startTime")
    Long countByCreateTimeAfter(@Param("startTime") LocalDateTime startTime);
    
    /**
     * 统计指定时间范围内完成的任务数
     */
    @Query("SELECT COUNT(t) FROM TodoTask t WHERE t.status = 1 AND t.finishTime >= :startTime")
    Long countFinishedByFinishTimeAfter(@Param("startTime") LocalDateTime startTime);
    
    /**
     * 按优先级统计完成率
     */
    @Query("SELECT t.priority, COUNT(t) FROM TodoTask t WHERE t.createTime >= :startTime GROUP BY t.priority")
    List<Object[]> countByPriorityAndCreateTimeAfter(@Param("startTime") LocalDateTime startTime);
    
    /**
     * 按优先级统计已完成任务数
     */
    @Query("SELECT t.priority, COUNT(t) FROM TodoTask t WHERE t.status = 1 AND t.finishTime >= :startTime GROUP BY t.priority")
    List<Object[]> countFinishedByPriorityAndFinishTimeAfter(@Param("startTime") LocalDateTime startTime);
    
    /**
     * 统计每日新增任务数
     */
    @Query("SELECT DATE(t.createTime) as date, COUNT(t) FROM TodoTask t " +
           "WHERE t.createTime >= :startTime GROUP BY DATE(t.createTime) ORDER BY date")
    List<Object[]> countDailyCreated(@Param("startTime") LocalDateTime startTime);
    
    /**
     * 统计每日完成任务数
     */
    @Query("SELECT DATE(t.finishTime) as date, COUNT(t) FROM TodoTask t " +
           "WHERE t.status = 1 AND t.finishTime >= :startTime GROUP BY DATE(t.finishTime) ORDER BY date")
    List<Object[]> countDailyFinished(@Param("startTime") LocalDateTime startTime);
}

