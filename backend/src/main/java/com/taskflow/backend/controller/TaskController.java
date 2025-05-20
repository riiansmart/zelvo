package com.taskflow.backend.controller;

import com.taskflow.backend.dto.ApiResponse;
import com.taskflow.backend.dto.PageRequest;
import com.taskflow.backend.model.Task;
import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.dto.TaskResponseDTO;
import com.taskflow.backend.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Get all tasks for the current user with pagination
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

    // Get a specific task by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> getTask(@PathVariable Long id) {
        TaskResponseDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    // Create a new task
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(@RequestBody TaskRequest request) {
        TaskResponseDTO createdTask = taskService.createTask(request);
        return ResponseEntity.ok(ApiResponse.success(createdTask, "Task created successfully"));
    }

    // Update an existing task
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        TaskResponseDTO updatedTask = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedTask, "Task updated successfully"));
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }

    // Bulk create tasks
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<Task>>> createBulkTasks(@RequestBody List<Task> tasks) {
        List<Task> createdTasks = taskService.createBulkTasks(tasks);
        return ResponseEntity.ok(ApiResponse.success(createdTasks, "Tasks created successfully"));
    }

    // Bulk update tasks
    @PutMapping("/bulk")
    public ResponseEntity<ApiResponse<List<Task>>> updateBulkTasks(@RequestBody List<Task> tasks) {
        List<Task> updatedTasks = taskService.updateBulkTasks(tasks);
        return ResponseEntity.ok(ApiResponse.success(updatedTasks, "Tasks updated successfully"));
    }

    // Bulk delete tasks
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<?>> deleteBulkTasks(@RequestBody List<Long> taskIds) {
        taskService.deleteBulkTasks(taskIds);
        return ResponseEntity.ok(ApiResponse.success(null, "Tasks deleted successfully"));
    }
}
