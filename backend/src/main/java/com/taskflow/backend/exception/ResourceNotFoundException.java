package com.taskflow.backend.exception;

/**
 * Thrown when a requested Zelvo resource cannot be located in persistence.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
} 