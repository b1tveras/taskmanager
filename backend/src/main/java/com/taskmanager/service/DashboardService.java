package com.taskmanager.service;

import com.taskmanager.dto.DashboardDTO;
import com.taskmanager.dto.TaskDTO;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final AuthService authService;
    private final TaskService taskService;

    @Transactional(readOnly = true)
    public DashboardDTO getDashboard() {
        User currentUser = authService.getCurrentUser();
        List<Project> projects = projectRepository.findAllByMemberOrOwner(currentUser);

        if (projects.isEmpty()) {
            return DashboardDTO.builder()
                    .totalProjects(0).totalTasks(0)
                    .todoCount(0).inProgressCount(0).doneCount(0).overdueCount(0)
                    .recentTasks(List.of()).overdueTasks(List.of())
                    .build();
        }

        long totalTasks = taskRepository.countByProjects(projects);
        long todoCount = taskRepository.countByProjectsAndStatus(projects, Task.Status.TODO);
        long inProgressCount = taskRepository.countByProjectsAndStatus(projects, Task.Status.IN_PROGRESS);
        long doneCount = taskRepository.countByProjectsAndStatus(projects, Task.Status.DONE);
        long overdueCount = taskRepository.countOverdueByProjects(projects, LocalDate.now());

        List<TaskDTO.Response> recentTasks = taskRepository
                .findByProjectsOrderByCreatedAtDesc(projects)
                .stream().limit(10).map(taskService::toResponse).collect(Collectors.toList());

        List<TaskDTO.Response> overdueTasks = taskRepository
                .findOverdueTasksForProjects(projects, LocalDate.now())
                .stream().map(taskService::toResponse).collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalProjects(projects.size())
                .totalTasks(totalTasks)
                .todoCount(todoCount)
                .inProgressCount(inProgressCount)
                .doneCount(doneCount)
                .overdueCount(overdueCount)
                .recentTasks(recentTasks)
                .overdueTasks(overdueTasks)
                .build();
    }
}
