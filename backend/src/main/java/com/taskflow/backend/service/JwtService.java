package com.taskflow.backend.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.taskflow.backend.model.User;
import com.taskflow.backend.security.JwtUtils;

/**
 * Thin wrapper around {@link JwtUtils} exposing token utility operations to other Zelvo services.
 */
@Service
public class JwtService {

    private final JwtUtils jwtUtils;

    public JwtService(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    /**
     * Generates a signed JWT for the supplied user.
     *
     * @param user application user
     * @return signed JWT string
     */
    public String generateToken(User user) {
        return jwtUtils.generateToken(user);
    }

    /**
     * Extracts the email claim from a JWT.
     *
     * @param token JWT token
     * @return user email embedded in token
     */
    public String getEmailFromToken(String token) {
        return jwtUtils.extractUsername(token);
    }

    /**
     * Validates that the token belongs to the provided user details.
     *
     * @param token        JWT token
     * @param userDetails  Spring Security user details
     * @return true if valid and matches user
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        return jwtUtils.validateToken(token, userDetails);
    }
}
