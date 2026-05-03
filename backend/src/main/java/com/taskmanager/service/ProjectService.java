package com.taskmanager.service;

import com.taskmanager.dto.ProjectDTO;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional
    public ProjectDTO.Response createProject(ProjectDTO.CreateRequest request) {
        User currentUser = authService.getCurrentUser();
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();
        project.getMembers().add(currentUser);
        return toResponse(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO.Response> getMyProjects() {
        User currentUser = authService.getCurrentUser();
        return projectRepository.findAllByMemberOrOwner(currentUser)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDTO.Response getProject(Long id) {
        Project project = findProjectAndVerifyAccess(id);
        return toResponse(project);
    }

    @Transactional
    public ProjectDTO.Response updateProject(Long id, ProjectDTO.UpdateRequest request) {
        Project project = findProjectAndVerifyOwner(id);
        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = findProjectAndVerifyOwner(id);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectDTO.Response addMember(Long projectId, ProjectDTO.AddMemberRequest request) {
        Project project = findProjectAndVerifyOwner(projectId);
        User newMember = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
        if (project.getMembers().contains(newMember)) {
            throw new BadRequestException("User is already a member of this project");
        }
        project.getMembers().add(newMember);
        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectDTO.Response removeMember(Long projectId, Long userId) {
        Project project = findProjectAndVerifyOwner(projectId);
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (member.equals(project.getOwner())) {
            throw new BadRequestException("Cannot remove project owner from project");
        }
        project.getMembers().remove(member);
        return toResponse(projectRepository.save(project));
    }

    public Project findProjectAndVerifyAccess(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        User currentUser = authService.getCurrentUser();
        boolean isMember = project.getMembers().contains(currentUser);
        boolean isOwner = project.getOwner().equals(currentUser);
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        if (!isMember && !isOwner && !isAdmin) {
            throw new AccessDeniedException("You don't have access to this project");
        }
        return project;
    }

    private Project findProjectAndVerifyOwner(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        User currentUser = authService.getCurrentUser();
        boolean isOwner = project.getOwner().equals(currentUser);
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Only project owner or admin can perform this action");
        }
        return project;
    }

    public ProjectDTO.Response toResponse(Project project) {
        return ProjectDTO.Response.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .owner(toMemberInfo(project.getOwner()))
                .members(project.getMembers().stream().map(this::toMemberInfo).collect(Collectors.toSet()))
                .taskCount(project.getTasks().size())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private ProjectDTO.MemberInfo toMemberInfo(User user) {
        return ProjectDTO.MemberInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
