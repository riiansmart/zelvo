package com.taskflow.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.dto.ApiResponse;
import com.taskflow.backend.model.Category;
import com.taskflow.backend.service.CategoryService;

/**
 * REST controller that exposes endpoints for retrieving task categories used across the Zelvo application.
 */
@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Retrieves all available task categories.
     *
     * @return {@link ApiResponse} containing a list of {@link Category} records
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
} 