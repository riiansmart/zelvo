package com.taskflow.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.List;

// DTO for task creation or update requests
@Data
public class TaskRequest {
    private String title;
    private String description;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dueDate;
    private String priority;
    private boolean completed;
    private Long categoryId;
    private String status;
    private String type;
    private Integer storyPoints;
    private List<String> labels;
    private List<Long> dependencies;
    private Long assigneeId;
}
