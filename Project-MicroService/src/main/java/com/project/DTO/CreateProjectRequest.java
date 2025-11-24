package com.project.DTO;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class CreateProjectRequest {

	private String title;

	private String description;

	private BigDecimal budget;

	private List<String> requiredSkillNames;
}
