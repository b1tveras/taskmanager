package com.taskmanager.service;

import com.taskmanager.dto.TaskDTO;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;
    private final AuthService authService;

    @Transactional
    public TaskDTO.Response createTask(Long projectId, TaskDTO.CreateRequest request) {
        Project project = projectService.findProjectAndVerifyAccess(projectId);
        User currentUser = authService.getCurrentUser();

        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getAssignedToId()));
            if (!project.getMembers().contains(assignedTo)) {
                throw new BadRequestException("Assigned user is not a member of this project");
            }
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
                .dueDate(request.getDueDate())
                .project(project)
                .assignedTo(assignedTo)
                .createdBy(currentUser)
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskDTO.Response> getTasksByProject(Long projectId) {
        Project project = projectService.findProjectAndVerifyAccess(projectId);
        return taskRepository.findByProject(project)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO.Response getTask(Long taskId) {
        Task task = getTaskAndVerifyAccess(taskId);
        return toResponse(task);
    }

    @Transactional
    public TaskDTO.Response updateTask(Long taskId, TaskDTO.UpdateRequest request) {
        Task task = getTaskAndVerifyAccess(taskId);
        User currentUser = authService.getCurrentUser();

        boolean isOwner = task.getProject().getOwner().equals(currentUser);
        boolean isAssignee = currentUser.equals(task.getAssignedTo());
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;

        if (!isOwner && !isAssignee && !isAdmin) {
            throw new AccessDeniedException("You don't have permission to update this task");
        }

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getAssignedToId()));
            task.setAssignedTo(assignedTo);
        }

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskDTO.Response assignTask(Long taskId, TaskDTO.AssignRequest request) {
        Task task = getTaskAndVerifyAccess(taskId);
        User assignedTo = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getUserId()));
        if (!task.getProject().getMembers().contains(assignedTo)) {
            throw new BadRequestException("User is not a member of this project");
        }
        task.setAssignedTo(assignedTo);
        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = getTaskAndVerifyAccess(taskId);
        User currentUser = authService.getCurrentUser();
        boolean isOwner = task.getProject().getOwner().equals(currentUser);
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Only project owner or admin can delete tasks");
        }
        taskRepository.delete(task);
    }

    private Task getTaskAndVerifyAccess(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        projectService.findProjectAndVerifyAccess(task.getProject().getId());
        return task;
    }

    public TaskDTO.Response toResponse(Task task) {
        TaskDTO.AssigneeInfo assignedTo = null;
        if (task.getAssignedTo() != null) {
            assignedTo = new TaskDTO.AssigneeInfo(
                    task.getAssignedTo().getId(),
                    task.getAssignedTo().getName(),
                    task.getAssignedTo().getEmail()
            );
        }
        TaskDTO.AssigneeInfo createdBy = new TaskDTO.AssigneeInfo(
                task.getCreatedBy().getId(),
                task.getCreatedBy().getName(),
                task.getCreatedBy().getEmail()
        );

        return TaskDTO.Response.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .dueDate(task.getDueDate())
                .overdue(task.isOverdue())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .assignedTo(assignedTo)
                .createdBy(createdBy)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
