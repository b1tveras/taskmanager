package com.taskmanager.dto;

import com.taskmanager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDTO {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        @Size(max = 300)
        private String title;

        @Size(max = 2000)
        private String description;

        private Task.Status status = Task.Status.TODO;

        private LocalDate dueDate;

        private Long assignedToId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateRequest {
        @Size(max = 300)
        private String title;

        @Size(max = 2000)
        private String description;

        private Task.Status status;

        private LocalDate dueDate;

        private Long assignedToId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String status;
        private LocalDate dueDate;
        private boolean overdue;
        private Long projectId;
        private String projectName;
        private AssigneeInfo assignedTo;
        private AssigneeInfo createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AssigneeInfo {
        private Long id;
        private String name;
        private String email;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AssignRequest {
        @NotNull(message = "User ID is required")
        private Long userId;
    }
}
