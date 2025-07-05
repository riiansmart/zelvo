package com.taskflow.backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.taskflow.backend.model.User;
import com.taskflow.backend.service.JwtService;

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