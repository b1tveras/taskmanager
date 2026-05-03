package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class ProjectDTO {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotBlank(message = "Project name is required")
        @Size(max = 200)
        private String name;

        @Size(max = 1000)
        private String description;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateRequest {
        @Size(max = 200)
        private String name;

        @Size(max = 1000)
        private String description;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private MemberInfo owner;
        private Set<MemberInfo> members;
        private int taskCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MemberInfo {
        private Long id;
        private String name;
        private String email;
        private String role;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AddMemberRequest {
        @NotBlank(message = "Email is required")
        private String email;
    }
}
