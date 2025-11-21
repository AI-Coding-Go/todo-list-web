package com.todo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger API文档配置
 */
@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("个人待办清单API文档")
                        .version("1.0.0")
                        .description("个人待办清单后端服务RESTful API文档")
                        .contact(new Contact()
                                .name("Todo Backend")
                                .email("")));
    }
}

