package com.taskflow.backend.dto;

import com.taskflow.backend.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO returned after a profile update. Includes the updated user and,
 * if necessary, a freshly issued JWT reflecting changes (e.g., email updates).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateResponse {
    private User user;
    private String token;
}


