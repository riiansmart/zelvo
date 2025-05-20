package com.taskflow.backend.repository;

import com.taskflow.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Optionally extend with custom queries if needed later
    boolean existsByName(String name);
}