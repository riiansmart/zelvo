package com.taskflow.backend.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.MockedStatic;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;

class UserServiceTests {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final UserService userService = new UserService(userRepository, passwordEncoder);

    @BeforeEach
    void setupSecurityContext() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);

        when(auth.getPrincipal()).thenReturn("test@example.com");
        when(context.getAuthentication()).thenReturn(auth);

        // Mock the static SecurityContextHolder.getContext()
        MockedStatic<SecurityContextHolder> securityContextHolderMock = mockStatic(SecurityContextHolder.class);
        securityContextHolderMock.when(SecurityContextHolder::getContext).thenReturn(context);
    }
    @Test
    void testUpdateUserProfile() {
        User currentUser = new User();
        currentUser.setEmail("test@example.com");
        currentUser.setName("Old Name");

        User updatedUser = new User();
        updatedUser.setEmail("test@example.com");
        updatedUser.setName("New Name");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(currentUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        User result = userService.updateUser(updatedUser);

        assertEquals("New Name", result.getName());
    }
}
