package com.taskflow.backend.exception;

/**
 * Indicates that the current principal is not permitted to perform the attempted Zelvo operation.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
} 