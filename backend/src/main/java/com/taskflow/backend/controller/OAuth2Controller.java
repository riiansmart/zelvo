package com.taskflow.backend.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;
import com.taskflow.backend.security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Controller that finalizes the OAuth2 login flow for Zelvo, handling provider callbacks
 * and translating successful authentications into JWT tokens that the frontend can consume.
 */
@RestController
@RequestMapping("/api/v1/auth/oauth2")
@CrossOrigin
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Handles the GitHub OAuth2 redirect URI. The actual OAuth2 negotiation is performed by Spring Security; 
     * this endpoint merely redirects the user back to the Zelvo frontend once authorization is complete.
     *
     * @param code  the authorization code returned by GitHub (unused – handled by Spring Security)
     * @param state CSRF protection state parameter (unused)
     * @param response servlet response used to issue a client-side redirect
     */
    @GetMapping("/callback/github")
    public void handleGithubCallback(@RequestParam String code, @RequestParam String state, HttpServletResponse response) throws IOException {
        // Note: The actual OAuth authentication is handled by Spring Security
        // This endpoint is just for handling the redirect back to the frontend
        response.sendRedirect("http://localhost:5173/dashboard");
    }

    /**
     * Invoked after a successful OAuth2 authentication. Generates application JWT tokens for the authenticated user
     * and redirects them to the Zelvo dashboard with the token as a URL parameter.
     *
     * @param authentication Spring Security authentication containing the OAuth2User principal
     * @param response servlet response used for HTTP redirect
     */
    @GetMapping("/success")
    public void oauth2Success(Authentication authentication, HttpServletResponse response) throws IOException {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oauth2User.getAttributes();

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String githubId = attributes.get("id").toString();

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name);
                        newUser.setGithubId(githubId);
                        newUser.setRole("USER");
                        newUser.setActive(true);
                        return userRepository.save(newUser);
                    });

            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generate JWT tokens
            String token = jwtTokenProvider.generateToken(authentication);

            // Redirect to frontend with token
            String redirectUrl = String.format("http://localhost:5173/dashboard?token=%s",
                URLEncoder.encode(token, StandardCharsets.UTF_8));
            response.sendRedirect(redirectUrl);
        } else {
            response.sendRedirect("http://localhost:5173/login?error=authentication_failed");
        }
    }
} 