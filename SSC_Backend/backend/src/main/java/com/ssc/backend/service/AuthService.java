package com.ssc.backend.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssc.backend.dto.AuthRequestDTO;
import com.ssc.backend.dto.AuthResponseDTO;
import com.ssc.backend.entity.Account;
import com.ssc.backend.repository.AccountRepository;
import com.ssc.backend.security.JwtUtil;

@Service
public class AuthService {

    // Whitelist: Chỉ 2 vai trò này được phép tự đăng ký qua API công khai
    private static final Set<String> ALLOWED_REGISTER_ROLES = Set.of(
            "ROLE_CUSTOMER",
            "ROLE_SUPPLIER"
    );

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String register(AuthRequestDTO request) {
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Tên đăng nhập và mật khẩu không được để trống!");
        }

        String normalizedUsername = request.getUsername().trim();
        if (accountRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại!");
        }

        // Mặc định là ROLE_CUSTOMER nếu client không gửi role
        String role = (request.getRole() == null || request.getRole().isBlank())
                ? "ROLE_CUSTOMER"
                : request.getRole().trim().toUpperCase();

        // Chặn bằng Whitelist: từ chối ROLE_ADMIN và mọi giá trị không hợp lệ
        if (!ALLOWED_REGISTER_ROLES.contains(role)) {
            throw new IllegalArgumentException(
                    "Vai trò không hợp lệ! Chỉ cho phép đăng ký ROLE_CUSTOMER hoặc ROLE_SUPPLIER."
            );
        }

        Account newAccount = new Account(
                normalizedUsername,
                passwordEncoder.encode(request.getPassword()),
                role
        );
        accountRepository.save(newAccount);
        return "Đăng ký tài khoản thành công!";
    }

    public AuthResponseDTO login(AuthRequestDTO request) {
        Account account = accountRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new IllegalArgumentException("Sai tên đăng nhập hoặc mật khẩu!"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Sai tên đăng nhập hoặc mật khẩu!");
        }

        String token = jwtUtil.generateToken(account.getUsername(), account.getRole());
        return new AuthResponseDTO(token, account.getUsername(), account.getRole());
    }

    public String logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                // TODO (Bước 8 - Tích hợp Redis): Đẩy token này vào Blacklist trên ssc-cache
                // với TTL bằng thời gian sống còn lại của JWT để vô hiệu hóa hoàn toàn trước hạn.
            }
        }
        return "Đăng xuất thành công!";
    }
}