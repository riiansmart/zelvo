package com.taskflow.backend.repository;

import com.taskflow.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find all tasks for a specific user ID
    List<Task> findByUserId(Long userId);
}