package com.freelancer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.freelancer.entities.Bid;

public interface BidRepository extends JpaRepository<Bid, Long> {

	List<Bid> findByProjectId(Long projectId);

	List<Bid> findByFreelancerId(Long freelancerId);
}
