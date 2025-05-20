package com.taskflow.backend.dto;

import lombok.Data;

// DTO for login form submission
@Data
public class LoginRequest {
    private String email;
    private String password;
}