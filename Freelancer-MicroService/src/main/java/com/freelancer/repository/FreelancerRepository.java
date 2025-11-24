package com.freelancer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.freelancer.entities.Freelancer;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long>{

	Optional<Freelancer> findByUserId(Long userId);

}
