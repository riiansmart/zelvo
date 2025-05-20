package com.taskflow.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private String status;
    private T data;
    private String message;
    private Metadata metadata;

    @Data
    @NoArgsConstructor
    public static class Metadata {
        private Integer page;
        private Integer size;
        private Long total;
        private String sort;
        private String filter;
    }

    public ApiResponse(String status, T data, String message, Metadata metadata) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.metadata = metadata;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("success", data, null, null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>("success", data, message, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("error", null, message, null);
    }
} 