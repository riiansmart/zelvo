package com.taskflow.backend.service;

import com.taskflow.backend.model.User;
import com.taskflow.backend.security.JwtUtils;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtUtils jwtUtils;

    public JwtService(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    // Generate token for a given user
    public String generateToken(User user) {
        return jwtUtils.generateToken(user);
    }

    // Validate token and return user email
    public String getEmailFromToken(String token) {
        return jwtUtils.extractUsername(token);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return jwtUtils.validateToken(token, userDetails);
    }
}
