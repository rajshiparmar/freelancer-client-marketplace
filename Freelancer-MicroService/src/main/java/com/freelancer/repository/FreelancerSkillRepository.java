package com.freelancer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.freelancer.entities.FreelancerSkill;

public interface FreelancerSkillRepository extends JpaRepository<FreelancerSkill, Long> {

	List<FreelancerSkill> findByFreelancerId(Long freelancerId);

	Optional<FreelancerSkill> findByFreelancerIdAndSkillNameIgnoreCase(Long freelancerId, String skillName);
}
