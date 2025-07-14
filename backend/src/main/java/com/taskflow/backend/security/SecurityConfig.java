package com.taskflow.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration for Zelvo.
 * Sets up JWT authentication, OAuth2 login and authorization rules.
 */
@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationEntryPoint unauthorizedHandler;
    private final OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;

    public SecurityConfig(AuthenticationEntryPoint unauthorizedHandler, OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.oauth2AuthenticationSuccessHandler = oauth2AuthenticationSuccessHandler;
    }

    /**
     * Builds the {@link SecurityFilterChain} that secures the application.
     * <p>
     * Key responsibilities:
     * <ul>
     *   <li>Disable CSRF because JWT is used.</li>
     *   <li>Configure CORS via separate {@code WebConfig}.</li>
     *   <li>Expose public endpoints (auth, docs, categories).</li>
     *   <li>Register {@link JwtAuthenticationFilter} before username/password filter.</li>
     *   <li>Integrate OAuth2 login success handler.</li>
     *   <li>Enforce stateless sessions.</li>
     * </ul>
     *
     * @param http {@link HttpSecurity} builder
     * @return configured filter chain
     * @throws Exception in case the security chain cannot be built
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .exceptionHandling(handling -> handling.authenticationEntryPoint(unauthorizedHandler))
                .cors(cors -> {})
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/code/*",
                                // Swagger UI v3 (OpenAPI)
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2AuthenticationSuccessHandler)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}