package com.taskflow.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.dto.ApiResponse;
import com.taskflow.backend.dto.PageRequest;
import com.taskflow.backend.dto.UserSummaryDTO;
import com.taskflow.backend.model.User;
import com.taskflow.backend.service.UserService;

/**
 * REST controller responsible for user-centric endpoints such as profile management,
 * preferences, activity history, and password operations in the Zelvo application.
 */
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Returns the authenticated user’s profile details.
     *
     * @return current {@link User} wrapped in {@link ApiResponse}
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    /**
     * Updates the authenticated user’s profile.
     *
     * @param user partial {@link User} object containing updatable fields
     * @return updated user entity
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody User user) {
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Profile updated successfully"));
    }

    /**
     * Retrieves the user’s saved preference map.
     *
     * @return preference key/value pairs
     */
    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<?>> getUserPreferences() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserPreferences()));
    }

    /**
     * Persists new preference settings for the current user.
     *
     * @param preferences preference object (expected Map)
     * @return success confirmation
     */
    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<?>> updateUserPreferences(@RequestBody Object preferences) {
        userService.updateUserPreferences(preferences);
        return ResponseEntity.ok(ApiResponse.success(null, "Preferences updated successfully"));
    }

    /**
     * Returns a paginated view of the user’s activity history.
     */
    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<Page<?>>> getUserActivity(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        PageRequest pageRequest = new PageRequest(page, size);
        Page<?> activity = userService.getUserActivity(pageRequest);
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    /**
     * Changes the user’s password after validating the current one.
     *
     * @param currentPassword existing password
     * @param newPassword     desired new password
     */
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword) {
        userService.changePassword(currentPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }

    /**
     * Sends a password-reset email to the specified address.
     *
     * @param email the user’s email address
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> requestPasswordReset(@RequestParam String email) {
        userService.requestPasswordReset(email);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset instructions sent to your email"));
    }

    /**
     * Resets the password using a previously issued reset token.
     *
     * @param token      reset token
     * @param newPassword new password to set
     */
    @PostMapping("/reset-password/{token}")
    public ResponseEntity<ApiResponse<?>> resetPassword(
            @PathVariable String token,
            @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully"));
    }

    /**
     * Lists users that can be assigned to tasks (active users only).
     *
     * @return list of minimal user summaries
     */
    @GetMapping("/assignable")
    public ResponseEntity<ApiResponse<List<UserSummaryDTO>>> getAssignableUsers() {
        List<UserSummaryDTO> users = userService.getAssignableUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
