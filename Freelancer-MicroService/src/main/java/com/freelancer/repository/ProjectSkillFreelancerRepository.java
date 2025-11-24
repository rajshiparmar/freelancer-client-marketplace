package com.freelancer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.freelancer.entities.ProjectSkillFreelancer;

public interface ProjectSkillFreelancerRepository extends JpaRepository<ProjectSkillFreelancer, Long> {

	List<ProjectSkillFreelancer> findByProjectId(Long projectId);

	List<ProjectSkillFreelancer> findByFreelancerId(Long freelancerId);
}
