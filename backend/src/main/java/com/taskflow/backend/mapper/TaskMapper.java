package com.taskflow.backend.mapper;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.dto.TaskResponseDTO;
import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;

/**
 * Maps between API DTOs and {@link Task} entities for Zelvo.
 * Centralizes transformation logic so that controllers/services remain thin.
 */
@Component
public class TaskMapper {
    /**
     * Converts a {@link TaskRequest} into a {@link Task} entity.
     *
     * @param request   client payload
     * @param assigneeOpt optional assignee user
     * @return populated entity (not yet persisted)
     */
    // Convert TaskRequest to Task entity
    public Task toEntity(TaskRequest request, Optional<User> assigneeOpt) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority() != null ? Task.Priority.valueOf(request.getPriority().toUpperCase()) : null);
        task.setType(request.getType());
        task.setStoryPoints(request.getStoryPoints());
        task.setLabels(request.getLabels());
        task.setDependencies(request.getDependencies());
        assigneeOpt.ifPresent(task::setAssignee);
        return task;
    }

    /**
     * Converts a {@link Task} entity into a {@link TaskResponseDTO} for API responses.
     */
    // Convert Task entity to TaskResponseDTO
    public TaskResponseDTO toResponse(Task task) {
        TaskResponseDTO response = new TaskResponseDTO();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority() != null ? task.getPriority().toString() : null);
        response.setType(task.getType());
        response.setStoryPoints(task.getStoryPoints());
        response.setLabels(task.getLabels());
        response.setDependencies(task.getDependencies());
        response.setAssigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null);
        response.setAssigneeName(task.getAssignee() != null ? task.getAssignee().getName() : null);
        response.setDueDate(task.getDueDate() != null ? task.getDueDate().toString() : null);
        response.setCreatedAt(task.getCreatedAt() != null ? task.getCreatedAt().toString() : null);
        response.setUpdatedAt(task.getUpdatedAt() != null ? task.getUpdatedAt().toString() : null);
        response.setUserId(task.getUser() != null ? task.getUser().getId() : null);
        response.setCompleted(task.isCompleted());
        // Category information
        if (task.getCategory() != null) {
            response.setCategoryId(task.getCategory().getId());
            response.setCategoryName(task.getCategory().getName());
            response.setCategoryColor(task.getCategory().getColor());
        }
        return response;
    }
}