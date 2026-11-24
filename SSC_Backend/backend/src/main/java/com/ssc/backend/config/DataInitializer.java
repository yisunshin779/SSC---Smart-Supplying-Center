package com.ssc.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ssc.backend.entity.Account;
import com.ssc.backend.repository.AccountRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDefaultAdmin(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String defaultAdmin = "admin_ssc";
            if (accountRepository.findByUsername(defaultAdmin).isEmpty()) {
                Account admin = new Account();
                admin.setUsername(defaultAdmin);
                admin.setPassword(passwordEncoder.encode("Admin@2026"));
                admin.setRole("ROLE_ADMIN");
                accountRepository.save(admin);
                System.out.println(">>> Đã khởi tạo tài khoản Quản trị mặc định: " + defaultAdmin);
            }
        };
    }
}