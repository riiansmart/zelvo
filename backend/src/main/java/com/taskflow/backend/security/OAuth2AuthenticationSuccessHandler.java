package com.taskflow.backend.security;

import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.oauth2.redirectUri:http://localhost:5173/oauth/redirect}") // Frontend redirect URI
    private String frontendRedirectUri;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional // Add transactional annotation for database operations
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (!(authentication.getPrincipal() instanceof OAuth2User oauthUser)) {
             super.onAuthenticationSuccess(request, response, authentication);
             return;
        }

        // Extract user info
        Map<String, Object> attributes = oauthUser.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        // Ensure githubId is retrieved correctly (might be integer or string)
        Object githubIdObject = attributes.get("id");
        String githubId = (githubIdObject != null) ? String.valueOf(githubIdObject) : null;

        if (email == null) {
            logger.warn("Email not found from OAuth2 provider (GitHub). Attributes: {}", attributes);
            // Potentially try fetching email via separate API call if needed and permitted by scope
            // For now, redirect to an error page
            String errorUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                                           .queryParam("error", "Email not provided by GitHub")
                                           .build().toUriString();
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
            return;
        }

        if (githubId == null) {
            logger.error("GitHub ID not found in OAuth2 attributes. Attributes: {}", attributes);
            String errorUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                                           .queryParam("error", "GitHub ID missing")
                                           .build().toUriString();
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
            return;
        }

        // Find or create user
        User user = processOAuthUser(email, name, githubId);

        // Create Authentication object for JwtTokenProvider
        // Use user.getEmail() as principal, null credentials, and derive authorities
        Authentication jwtAuthentication = new UsernamePasswordAuthenticationToken(
            user.getEmail(), 
            null, // No password needed for token generation context
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())) // Assuming role is like "USER", "ADMIN"
        );

        // Generate JWT token using JwtTokenProvider
        String token = jwtTokenProvider.generateToken(jwtAuthentication);

        // Build redirect URI with token
        String targetUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                .queryParam("token", token)
                .build().toUriString();

        // Clear authentication attributes if needed
        clearAuthenticationAttributes(request);

        // Redirect to frontend
        logger.info("Redirecting OAuth user {} to frontend with token", email);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    // This method should be transactional if called directly without the @Transactional on onAuthenticationSuccess
    private User processOAuthUser(String email, String name, String githubId) {
       Optional<User> userOptional = userRepository.findByEmail(email);
       User user;
       if (userOptional.isPresent()) {
           user = userOptional.get();
           logger.info("OAuth login for existing user: {}", email);
           // Check if the existing user signed up locally or via another provider
           if (user.getAuthProvider() == null) {
               logger.info("Linking GitHub account (ID: {}) to existing local user: {}", githubId, email);
               user.setAuthProvider("github");
               user.setGithubId(githubId); // Use githubId field
           } else if (!"github".equals(user.getAuthProvider())) {
               // Handle case where email exists but with a different provider (e.g., Google)
               // This might indicate an error or require account linking logic
               logger.warn("User {} already exists with provider {}, attempting GitHub login.", email, user.getAuthProvider());
               // You might throw an exception, redirect to an error page, or allow linking
               // For now, we'll just proceed but ensure the githubId is set if missing for this provider
               if (user.getGithubId() == null) {
                   user.setGithubId(githubId);
               }
           } else if (!githubId.equals(user.getGithubId())){
               // Log potential issue if github ID somehow changed for the same email
               logger.warn("GitHub ID mismatch for user {}. Existing: {}, New: {}. Updating.", email, user.getGithubId(), githubId);
               user.setGithubId(githubId); // Update to the latest GitHub ID
           }

           // Update name if it was null or differs from GitHub profile
           if (name != null && !name.equals(user.getName())) {
               logger.info("Updating name for user {} from '{}' to '{}'", email, user.getName(), name);
               user.setName(name);
           }
           user = userRepository.save(user); // Save changes

       } else {
           // Create new user for GitHub login
           logger.info("Creating new user for GitHub login: {}, GitHub ID: {}", email, githubId);
           user = new User();
           user.setEmail(email);
           user.setName(name); // Set name from GitHub
           user.setAuthProvider("github");
           user.setGithubId(githubId); // Use githubId field
           user.setRole("USER"); // Default role
           user.setActive(true); // Activate account immediately
           // Set a secure random password because the field is not nullable
           user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
           user = userRepository.save(user); // Save the new user
       }
       return user;
    }
} 