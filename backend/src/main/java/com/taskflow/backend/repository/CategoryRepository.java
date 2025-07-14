package com.taskflow.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskflow.backend.model.Category;

/**
 * Spring Data repository for {@link Category} persistence in Zelvo.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Checks if a category with the supplied name already exists.
     *
     * @param name unique category name
     * @return true if category name is taken
     */
    boolean existsByName(String name);
}