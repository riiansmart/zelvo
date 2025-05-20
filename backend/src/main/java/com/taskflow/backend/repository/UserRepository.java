package com.taskflow.backend.repository;

import com.taskflow.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by email (for login)
    Optional<User> findByEmail(String email);

    // Check if email already exists (for registration validation)
    boolean existsByEmail(String email);

    List<User> findByIsActiveTrue();
}
