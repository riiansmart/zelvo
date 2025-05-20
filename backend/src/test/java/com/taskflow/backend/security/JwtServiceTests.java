package com.taskflow.backend.security;

import com.taskflow.backend.model.User;
import com.taskflow.backend.service.JwtService;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtServiceTests {

    private final JwtUtils jwtUtils = mock(JwtUtils.class);
    private final JwtService jwtService = new JwtService(jwtUtils);

    @Test
    void testGenerateTokenDelegatesToUtils() {
        User user = new User();
        user.setEmail("test@example.com");

        when(jwtUtils.generateToken(user)).thenReturn("mock-token");

        String token = jwtService.generateToken(user);
        assertEquals("mock-token", token);
    }
}