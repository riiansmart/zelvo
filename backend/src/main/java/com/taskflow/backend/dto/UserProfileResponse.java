package com.taskflow.backend.dto;

import com.taskflow.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

// DTO for returning current user profile information
@Data
@AllArgsConstructor
public class UserProfileResponse {
    private User user;
}
