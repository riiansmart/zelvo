package com.taskflow.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskflow.backend.model.User;

/**
 * Repository for {@link User} entities, providing lookup helpers used throughout Zelvo’s authentication & task assignment flows.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by e-mail address.
     *
     * @param email e-mail
     * @return optional user
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether the e-mail is already registered.
     *
     * @param email e-mail to test
     * @return true if present
     */
    boolean existsByEmail(String email);

    /**
     * Retrieves all active users.
     *
     * @return active user list
     */
    List<User> findByIsActiveTrue();
}
