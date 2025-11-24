package com.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateProjectResponse {

	private Long projectId;
	private String message;
}
