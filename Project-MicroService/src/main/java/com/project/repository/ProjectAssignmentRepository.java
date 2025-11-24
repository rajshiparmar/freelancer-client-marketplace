package com.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.ProjectAssignment;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long> {

	List<ProjectAssignment> findByProjectIdIn(List<Long> projectIds);
	List<ProjectAssignment> findByProjectId(Long projectId);           

	
	
}
