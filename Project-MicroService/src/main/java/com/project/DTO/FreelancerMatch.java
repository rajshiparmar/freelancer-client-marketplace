package com.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerMatch {

	private Long freelancerId;
	private String name;
	private Double matchScore;
}
