package com.taskflow.backend.dto;

import lombok.Data;

// DTO for user registration form submission
@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
