package com.todo.vo;

import lombok.Data;
import java.util.List;

/**
 * 分页结果对象
 */
@Data
public class PageResult<T> {
    private List<T> data;
    private Long total;
    private Integer page;
    private Integer size;
    private Integer totalPages;
    
    public PageResult(List<T> data, Long total, Integer page, Integer size) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.size = size;
        this.totalPages = (int) Math.ceil((double) total / size);
    }
}

