package com.taskflow.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global MVC configuration bean for Zelvo; currently configures CORS for the SPA.
 */
@Configuration
public class WebConfig {

    /**
     * Defines lenient CORS settings for development hosts so that the Vite SPA can
     * make cross-origin requests to the backend API.
     */
    // Define a global CORS configuration bean
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/v1/**") // Apply CORS to your API endpoints
                        .allowedOrigins("http://localhost:5173", "http://localhost") // Allow Vite and Nginx origins
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true); // Allow credentials (cookies, authorization headers)
            }
        };
    }
} 