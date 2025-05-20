package com.taskflow.backend.service;

import com.taskflow.backend.dto.PageRequest;
import com.taskflow.backend.exception.ResourceNotFoundException;
import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import com.taskflow.backend.repository.CategoryRepository;
import com.taskflow.backend.model.Category;
import com.taskflow.backend.exception.UnauthorizedException;
import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.model.Task.Priority;
import com.taskflow.backend.dto.TaskResponseDTO;
import com.taskflow.backend.mapper.TaskMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TaskMapper taskMapper;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, CategoryRepository categoryRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.taskMapper = taskMapper;
    }

    // Get the currently authenticated user from security context
    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            return userDetails.getUsername(); // this is the email
        }

        return null;
    }

    public Page<TaskResponseDTO> getUserTasks(com.taskflow.backend.dto.PageRequest pageRequest) {
        Sort.Direction direction = Sort.Direction.fromString(pageRequest.getDirection().toUpperCase());
        Sort sort = pageRequest.getSort() != null ? 
            Sort.by(direction, pageRequest.getSort()) : 
            Sort.by(Sort.Direction.DESC, "createdAt");

        org.springframework.data.domain.PageRequest springPageRequest = 
            org.springframework.data.domain.PageRequest.of(pageRequest.getPage(), pageRequest.getSize(), sort);

        Page<Task> tasks = taskRepository.findAll(springPageRequest);
        return tasks.map(taskMapper::toResponse);
    }

    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return taskMapper.toResponse(task);
    }

    @Transactional
    public TaskResponseDTO createTask(TaskRequest request) {
        Optional<User> assigneeOpt = Optional.empty();
        if (request.getAssigneeId() != null) {
            assigneeOpt = userRepository.findById(request.getAssigneeId());
        }
        Task task = taskMapper.toEntity(request, assigneeOpt);
        // Set due date at start of day
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate().atStartOfDay());
        }
        task.setCompleted(request.isCompleted());
        // Set the current authenticated user
        String email = getAuthenticatedUser();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found with email: " + email));
        task.setUser(user);
        // Associate category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + request.getCategoryId()));
            task.setCategory(category);
        }
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponseDTO updateTask(Long id, TaskRequest request) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        Optional<User> assigneeOpt = Optional.empty();
        if (request.getAssigneeId() != null) {
            assigneeOpt = userRepository.findById(request.getAssigneeId());
        }
        Task updatedTask = taskMapper.toEntity(request, assigneeOpt);
        updatedTask.setId(existingTask.getId());
        updatedTask.setUser(existingTask.getUser());
        updatedTask.setCreatedAt(existingTask.getCreatedAt());
        // Set due date at start of day
        if (request.getDueDate() != null) {
            updatedTask.setDueDate(request.getDueDate().atStartOfDay());
        }
        updatedTask.setCompleted(request.isCompleted());
        // Update category association
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + request.getCategoryId()));
            updatedTask.setCategory(category);
        } else {
            updatedTask.setCategory(null);
        }
        Task saved = taskRepository.save(updatedTask);
        return taskMapper.toResponse(saved);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    @Transactional
    public List<Task> createBulkTasks(List<Task> tasks) {
        // TODO: Set current user for all tasks
        return taskRepository.saveAll(tasks);
    }

    @Transactional
    public List<Task> updateBulkTasks(List<Task> tasks) {
        // TODO: Validate and update tasks
        return taskRepository.saveAll(tasks);
    }

    @Transactional
    public void deleteBulkTasks(List<Long> taskIds) {
        taskRepository.deleteAllById(taskIds);
    }
}
