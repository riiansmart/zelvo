package com.taskflow.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.taskflow.backend.model.Category;
import com.taskflow.backend.repository.CategoryRepository;

/**
 * Business logic for CRUD operations on {@link Category} entities within Zelvo.
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Fetches all categories.
     *
     * @return list of categories
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Persists a new category record.
     *
     * @param category category to create
     * @return created category
     */
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}
