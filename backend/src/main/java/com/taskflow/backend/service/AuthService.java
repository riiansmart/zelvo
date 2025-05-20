package com.taskflow.backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskflow.backend.dto.JwtResponse;
import com.taskflow.backend.dto.LoginRequest;
import com.taskflow.backend.dto.RegisterRequest;
import com.taskflow.backend.exception.UnauthorizedException;
import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;
import com.taskflow.backend.security.JwtTokenProvider;

import io.jsonwebtoken.JwtException;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            logger.warn("Authentication failed for user {}: {}", request.getEmail(), e.getMessage());
            throw new UnauthorizedException("Invalid email or password.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String token;
        String refreshToken;
        try {
            token = jwtTokenProvider.generateToken(authentication);
            refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        } catch (JwtException e) {
            logger.error("Error generating JWT tokens for user {}: {}", authentication.getName(), e.getMessage(), e);
            throw new RuntimeException("Error generating authentication tokens. Please try again later.");
        } catch (Exception e) {
            logger.error("Unexpected error generating JWT tokens for user {}: {}", authentication.getName(), e.getMessage(), e);
            throw new RuntimeException("Unexpected error during token generation. Please try again later.");
        }

        User user;
        try {
            user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> {
                        logger.error("User {} authenticated but not found in repository.", authentication.getName());
                        return new UnauthorizedException("Authenticated user details not found. Please contact support.");
                    });
            
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        } catch (DataAccessException e) {
            logger.error("Data access error during login for user {}: {}", authentication.getName(), e.getMessage(), e);
            throw new RuntimeException("A data access error occurred while finalizing login. Please try again later.");
        }

        return new JwtResponse(token, refreshToken, user);
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UnauthorizedException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setActive(true);

        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();
        // TODO: Store verification token and send verification email

        userRepository.save(user);
    }

    @Transactional
    public void verifyEmail(String token) {
        // TODO: Implement email verification logic
        throw new UnauthorizedException("Not implemented");
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        // TODO: Generate new verification token and send email
    }

    public JwtResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Create authentication object for token generation
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, java.util.Collections.emptyList());
        
        String newToken = jwtTokenProvider.generateToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        return new JwtResponse(newToken, newRefreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        // TODO: Implement token invalidation logic
        // This could involve storing the token in a blacklist or deleting it from a valid tokens table
    }
}
