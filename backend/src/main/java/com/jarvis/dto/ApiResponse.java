package com.jarvis.dto;

import java.time.Instant;

public record ApiResponse<T>(
        boolean success,
        String message,
        String code,
        T data,
        Instant timestamp) {

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, "OK", data, Instant.now());
    }

    public static <T> ApiResponse<T> fail(String message, String code) {
        return new ApiResponse<>(false, message, code, null, Instant.now());
    }
}

