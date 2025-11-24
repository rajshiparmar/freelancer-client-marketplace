package com.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.entities.Project;


public interface ProjectRepository extends JpaRepository<Project, Long>{

//	List<Project> findByClientId(Long clientId);
	List<Project> findByClient_Id(Long clientId);

}
