package com.taskflow.backend.controller;

import com.taskflow.backend.dto.ApiResponse;
import com.taskflow.backend.dto.PageRequest;
import com.taskflow.backend.dto.UserSummaryDTO;
import com.taskflow.backend.model.User;
import com.taskflow.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get current user's profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    // Update current user's profile
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody User user) {
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Profile updated successfully"));
    }

    // Get user preferences
    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<?>> getUserPreferences() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserPreferences()));
    }

    // Update user preferences
    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<?>> updateUserPreferences(@RequestBody Object preferences) {
        userService.updateUserPreferences(preferences);
        return ResponseEntity.ok(ApiResponse.success(null, "Preferences updated successfully"));
    }

    // Get user activity history
    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<Page<?>>> getUserActivity(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        PageRequest pageRequest = new PageRequest(page, size);
        Page<?> activity = userService.getUserActivity(pageRequest);
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword) {
        userService.changePassword(currentPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }

    // Request password reset
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> requestPasswordReset(@RequestParam String email) {
        userService.requestPasswordReset(email);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset instructions sent to your email"));
    }

    // Reset password with token
    @PostMapping("/reset-password/{token}")
    public ResponseEntity<ApiResponse<?>> resetPassword(
            @PathVariable String token,
            @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully"));
    }

    @GetMapping("/assignable")
    public ResponseEntity<ApiResponse<List<UserSummaryDTO>>> getAssignableUsers() {
        List<UserSummaryDTO> users = userService.getAssignableUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
