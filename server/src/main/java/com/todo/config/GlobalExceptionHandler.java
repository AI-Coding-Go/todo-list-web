package com.todo.config;

import com.todo.vo.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(RuntimeException.class)
    public ApiResponse<?> handleRuntimeException(RuntimeException e) {
        log.error("运行时异常", e);
        return ApiResponse.error(e.getMessage());
    }
    
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ApiResponse<?> handleValidationException(Exception e) {
        log.error("参数验证异常", e);
        String message = "参数验证失败";
        if (e instanceof MethodArgumentNotValidException) {
            MethodArgumentNotValidException ex = (MethodArgumentNotValidException) e;
            if (ex.getBindingResult().hasFieldErrors()) {
                message = ex.getBindingResult().getFieldError().getDefaultMessage();
            }
        }
        return ApiResponse.error(400, message);
    }
    
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleException(Exception e) {
        log.error("系统异常", e);
        return ApiResponse.error("系统异常，请稍后重试");
    }
}

