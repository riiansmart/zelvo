package com.taskflow.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find all tasks for a specific user ID
    List<Task> findByUserId(Long userId);
    
    // Find all tasks for a specific user with pagination
    Page<Task> findByUser(User user, Pageable pageable);
}