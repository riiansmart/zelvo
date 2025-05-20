package com.taskflow.backend.dto;

import lombok.Data;

// DTO for user registration form submission
@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
}
