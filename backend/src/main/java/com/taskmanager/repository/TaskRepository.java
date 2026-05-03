package com.taskmanager.repository;

import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignedTo(User user);

    @Query("SELECT t FROM Task t WHERE t.project IN :projects ORDER BY t.createdAt DESC")
    List<Task> findByProjectsOrderByCreatedAtDesc(@Param("projects") List<Project> projects);

    @Query("SELECT t FROM Task t WHERE t.project IN :projects AND t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findOverdueTasksForProjects(@Param("projects") List<Project> projects, @Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project IN :projects AND t.status = :status")
    long countByProjectsAndStatus(@Param("projects") List<Project> projects, @Param("status") Task.Status status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project IN :projects AND t.dueDate < :today AND t.status != 'DONE'")
    long countOverdueByProjects(@Param("projects") List<Project> projects, @Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project IN :projects")
    long countByProjects(@Param("projects") List<Project> projects);
}
