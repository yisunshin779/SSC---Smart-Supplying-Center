package com.ssc.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // Khóa bí mật (phải dài tối thiểu 32 ký tự cho thuật toán HS256)
    private static final String SECRET_STRING = "SSC_Smart_Supplying_Center_Secret_Key_2026_Secure";
    private static final long EXPIRATION_TIME = 86400000; // 1 ngày (tính bằng mili-giây)

    private final SecretKey secretKey;

    // Constructor mặc định khởi tạo khóa bí mật
    public JwtUtil() {
        this.secretKey = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
    }

    // 1. Sinh JWT Token chứa username và role
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

    // 2. Giải mã toàn bộ nội dung (Claims) từ Token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // 3. Lấy username từ Token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 4. Lấy role từ Token
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // 5. Kiểm tra Token còn hạn và đúng chữ ký không
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}