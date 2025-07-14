package com.taskflow.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.dto.ApiResponse;
import com.taskflow.backend.dto.PageRequest;
import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.dto.TaskResponseDTO;
import com.taskflow.backend.model.Task;
import com.taskflow.backend.service.TaskService;

/**
 * REST controller providing CRUD operations for task resources within Zelvo.
 * Endpoints are scoped to the authenticated user by the service layer.
 */
@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Retrieves a paginated list of tasks belonging to the current user.
     *
     * @param page       zero-based page index (defaults to 0)
     * @param size       page size (defaults to 10)
     * @param sort       field to sort by (optional)
     * @param direction  sort direction: asc or desc (defaults to asc)
     * @param search     optional free-text search query
     * @param filter     optional filter expression (status, etc.)
     * @return paginated {@link TaskResponseDTO} list wrapped in {@link ApiResponse}
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TaskResponseDTO>>> getAllTasks(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String filter) {
        
        PageRequest pageRequest = new PageRequest(page, size, sort, direction);
        pageRequest.setSearch(search);
        pageRequest.setFilter(filter);
        
        Page<TaskResponseDTO> tasks = taskService.getUserTasks(pageRequest);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    /**
     * Retrieves a single task by its identifier, ensuring it belongs to the current user.
     *
     * @param id the task identifier
     * @return the requested {@link TaskResponseDTO}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> getTask(@PathVariable Long id) {
        TaskResponseDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    /**
     * Creates a new task owned by the current user.
     *
     * @param request DTO containing task details
     * @return the created task as {@link TaskResponseDTO}
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(@RequestBody TaskRequest request) {
        TaskResponseDTO createdTask = taskService.createTask(request);
        return ResponseEntity.ok(ApiResponse.success(createdTask, "Task created successfully"));
    }

    /**
     * Updates an existing task.
     *
     * @param id      identifier of the task to update
     * @param request DTO with fields to update
     * @return the updated task as {@link TaskResponseDTO}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        TaskResponseDTO updatedTask = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedTask, "Task updated successfully"));
    }

    /**
     * Deletes a task by ID.
     *
     * @param id identifier of the task to delete
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }

    /**
     * Creates multiple tasks in a single call.
     *
     * @param tasks list of task entities to persist
     * @return the persisted tasks
     */
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<Task>>> createBulkTasks(@RequestBody List<Task> tasks) {
        List<Task> createdTasks = taskService.createBulkTasks(tasks);
        return ResponseEntity.ok(ApiResponse.success(createdTasks, "Tasks created successfully"));
    }

    /**
     * Updates multiple tasks at once.
     *
     * @param tasks task entities with updated data
     * @return list of updated tasks
     */
    @PutMapping("/bulk")
    public ResponseEntity<ApiResponse<List<Task>>> updateBulkTasks(@RequestBody List<Task> tasks) {
        List<Task> updatedTasks = taskService.updateBulkTasks(tasks);
        return ResponseEntity.ok(ApiResponse.success(updatedTasks, "Tasks updated successfully"));
    }

    /**
     * Deletes multiple tasks provided by their IDs.
     *
     * @param taskIds list of IDs to remove
     */
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<?>> deleteBulkTasks(@RequestBody List<Long> taskIds) {
        taskService.deleteBulkTasks(taskIds);
        return ResponseEntity.ok(ApiResponse.success(null, "Tasks deleted successfully"));
    }
}
