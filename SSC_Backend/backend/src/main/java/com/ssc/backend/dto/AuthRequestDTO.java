package com.ssc.backend.dto;

public class AuthRequestDTO {
    private String username;
    private String password;
    private String role; // Dùng khi đăng ký (VD: ROLE_CUSTOMER, ROLE_ADMIN, ROLE_SUPPLIER)

    public AuthRequestDTO() {
    }

    public AuthRequestDTO(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}