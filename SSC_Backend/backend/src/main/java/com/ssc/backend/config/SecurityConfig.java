package com.ssc.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssc.backend.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) // Tự động nạp Bean CorsConfigurationSource từ CorsConfig
            .csrf(csrf -> csrf.disable())    // Tắt CSRF vì dùng JWT Stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Cho phép trình duyệt gửi preflight
                .requestMatchers("/api/auth/**", "/error").permitAll()  // Mở cổng Auth và luồng báo lỗi chuẩn

                // Mở comment dòng dưới nếu muốn Cổng Khách Hàng xem dữ liệu công khai không cần đăng nhập:
                // .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/suppliers/**").permitAll()

                // Phân quyền theo nhóm API (Spring tự ghép tiền tố ROLE_ thành ROLE_ADMIN, ROLE_SUPPLIER)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/supplier/**").hasAnyRole("SUPPLIER", "ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}