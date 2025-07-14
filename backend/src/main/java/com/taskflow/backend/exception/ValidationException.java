package com.taskflow.backend.exception;

/**
 * Raised when incoming request data fails Zelvo domain validation constraints.
 */
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
} 