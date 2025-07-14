package com.taskflow.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;

/**
 * Repository interface for CRUD and custom queries over {@link Task} entities in Zelvo.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Retrieves all tasks belonging to a user.
     *
     * @param userId user identifier
     * @return list of tasks owned by user
     */
    // Find all tasks for a specific user ID
    List<Task> findByUserId(Long userId);
    
    /**
     * Returns a paginated list of tasks for the provided user entity.
     *
     * @param user     user entity
     * @param pageable paging specification
     * @return page of tasks
     */
    // Find all tasks for a specific user with pagination
    Page<Task> findByUser(User user, Pageable pageable);
}