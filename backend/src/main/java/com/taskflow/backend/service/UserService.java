package com.taskflow.backend.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskflow.backend.dto.PageRequest;
import com.taskflow.backend.dto.UserSummaryDTO;
import com.taskflow.backend.exception.ResourceNotFoundException;
import com.taskflow.backend.exception.UnauthorizedException;
import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;

/**
 * Service providing user profile management, preference handling, password management and miscellaneous
 * user-related operations for Zelvo.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Retrieves the currently authenticated {@link User} from the security context.
     *
     * @return user entity bound to the current session
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("User not authenticated");
        }

        String username; // This will be the email
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
             username = (String) principal;
        } else {
            // Handle other principal types if necessary, or throw an error
            throw new UnauthorizedException("Unsupported principal type: " + principal.getClass().getName());
        }
        
        // Assuming username from token/principal is the email
        return userRepository.findByEmail(username)
               .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + username));
    }

    /**
     * Updates allowed profile fields of the authenticated user.
     *
     * @param user object containing new values
     * @return updated user instance
     */
    @Transactional
    public User updateUser(User user) {
        User currentUser = getCurrentUser(); // Get the user from DB based on security context
        
        // Update allowed fields (e.g., first/last name, settings)
        if (user.getFirstName() != null) {
             currentUser.setFirstName(user.getFirstName());
        }
        if (user.getLastName() != null) {
             currentUser.setLastName(user.getLastName());
        }
        if (user.getName() != null && (user.getFirstName() == null || user.getLastName() == null)) {
             // If legacy name field provided, still allow updating
             currentUser.setName(user.getName());
        }
        if (user.getSettings() != null) {
             currentUser.setSettings(user.getSettings());
        }
        // Add other updatable fields as needed
        
        // Don't update sensitive fields like email, password, role, provider from this method

        return userRepository.save(currentUser);
    }

    /**
     * Returns stored user preference map.
     *
     * @return preference map
     */
    public Map<String, Object> getUserPreferences() {
        User user = getCurrentUser();
        return user.getSettings();
    }

    /**
     * Saves new preference settings for the user.
     *
     * @param preferences map-like object holding preference values
     */
    @Transactional
    public void updateUserPreferences(Object preferences) {
        User user = getCurrentUser();
        // Ensure preferences is actually a Map before casting
        if (preferences instanceof Map) {
             user.setSettings((Map<String, Object>) preferences);
             userRepository.save(user);
        } else {
             // Handle incorrect preference format if needed
             throw new IllegalArgumentException("Preferences must be a valid map.");
        }
    }

    /**
     * Retrieves a paginated representation of user activity.
     */
    public Page<?> getUserActivity(PageRequest pageRequest) {
        User user = getCurrentUser();
        // TODO: Implement user activity tracking
        return Page.empty();
    }

    /**
     * Changes user password after verifying the old one.
     *
     * @param currentPassword existing password
     * @param newPassword     new password to set
     */
    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Initiates a password reset workflow by sending a reset token to the given email.
     *
     * @param email user email
     */
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        // TODO: Generate and send reset token
    }

    /**
     * Completes password reset using a token.
     *
     * @param token reset token
     * @param newPassword new password to apply
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // TODO: Validate token and reset password
        throw new UnauthorizedException("Not implemented");
    }

    /**
     * Returns lightweight summaries of users that can be assigned to tasks.
     *
     * @return list of user summaries
     */
    public List<UserSummaryDTO> getAssignableUsers() {
        return userRepository.findByIsActiveTrue().stream()
            .map(user -> new UserSummaryDTO(user.getId(), user.getName()))
            .collect(Collectors.toList());
    }
}
