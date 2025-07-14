package com.taskflow.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.dto.ApiResponse;
import com.taskflow.backend.dto.JwtResponse;
import com.taskflow.backend.dto.LoginRequest;
import com.taskflow.backend.dto.RegisterRequest;
import com.taskflow.backend.exception.UnauthorizedException;
import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;
import com.taskflow.backend.service.AuthService;

/**
 * REST controller that exposes authentication-related endpoints for the Zelvo platform.
 * Handles actions such as login, registration, email-verification, token refresh and logout.
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
public class AuthController {

    // Added logger instance
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    /**
     * Authenticates a user with the provided credentials and returns access & refresh JWT tokens.
     *
     * @param request the {@link LoginRequest} containing the user’s email and password
     * @return {@link ApiResponse} with a {@link JwtResponse} payload on success
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody LoginRequest request) {
        logger.info("Login attempt for email: {}", request != null ? request.getEmail() : "[request_is_null]");
        // Basic check for request payload, more robust validation can be added via @Valid if needed
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            logger.warn("Login attempt with missing email or password. Email: {}, Password provided: {}", 
                        request != null ? request.getEmail() : "[request_is_null]", 
                        (request != null && request.getPassword() != null) ? "Yes" : "No");
            // Consider returning a 400 Bad Request here if this is an issue often
            // For now, let it proceed to authService which should handle it or throw an error
        }
        
        JwtResponse response = authService.login(request);
        logger.info("Login successful for email: {}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    /**
     * Registers a new Zelvo user account.
     *
     * @param request the {@link RegisterRequest} carrying user registration data
     * @return success response when the user is created and verification mail sent
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(null, "User registered successfully"));
    }

    /**
     * Verifies a user’s email based on the verification token sent to their mailbox.
     *
     * @param token unique verification token
     * @return success response once the account is activated
     */
    @GetMapping("/verify-email/{token}")
    public ResponseEntity<ApiResponse<?>> verifyEmail(@PathVariable String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success(null, "Email verified successfully"));
    }

    /**
     * Resends a verification e-mail to the provided address in case the original one expired or was lost.
     *
     * @param email the user’s e-mail address
     * @return success response when the e-mail is queued/sent
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<?>> resendVerification(@RequestParam String email) {
        authService.resendVerificationEmail(email);
        return ResponseEntity.ok(ApiResponse.success(null, "Verification email sent successfully"));
    }

    /**
     * Issues a new access/refresh token pair when the presented refresh token is valid.
     *
     * @param refreshToken a valid JWT refresh token
     * @return {@link ApiResponse} with refreshed {@link JwtResponse}
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@RequestParam String refreshToken) {
        JwtResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
    }

    /**
     * Invalidates the supplied refresh token and clears authentication state for the user.
     *
     * @param refreshToken refresh token to invalidate
     * @return confirmation response once logout has completed
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(@RequestParam String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }

    /**
     * Retrieves the authenticated Zelvo user from the security context.
     *
     * @return {@link ApiResponse} wrapping the {@link User} entity corresponding to the currently logged-in principal
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("User not found"));

        return ResponseEntity.ok(ApiResponse.success(user, "User details retrieved successfully"));
    }
}