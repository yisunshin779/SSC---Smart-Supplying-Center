package com.ssc.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Áp dụng quy tắc này cho toàn bộ API của hệ thống SSC
                .allowedOrigins("http://localhost:5173") // Chỉ định đích danh cổng của React Vite
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các giao thức được phép qua trạm
                .allowedHeaders("*") // Mở cửa cho mọi loại Header (rất cần thiết khi bạn gắn Token bảo mật sau này)
                .allowCredentials(true); // Cho phép trình duyệt đính kèm cookie hoặc thông tin xác thực
    }
}