package com.taskflow.backend.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.boot.test.context.SpringBootTest;

import com.taskflow.backend.dto.TaskResponseDTO;
import com.taskflow.backend.mapper.TaskMapper;
import com.taskflow.backend.model.Task;
import com.taskflow.backend.repository.CategoryRepository;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;

@SpringBootTest
class TaskServiceTests {

    private final TaskRepository taskRepository = mock(TaskRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final CategoryRepository categoryRepository = mock(CategoryRepository.class);
    private final TaskMapper taskMapper = mock(TaskMapper.class);
    private final TaskService taskService = new TaskService(taskRepository, userRepository, categoryRepository, taskMapper);

    @Test
    void testGetTaskById() {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setId(1L);
        dto.setTitle("Test Task");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskMapper.toResponse(task)).thenReturn(dto);
        TaskResponseDTO result = taskService.getTaskById(1L);
        assertEquals("Test Task", result.getTitle());
    }
}