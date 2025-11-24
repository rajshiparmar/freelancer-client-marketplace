package com.freelancer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidsResponse {

	private Long bidId;
	
	private String message;
	
	private String status;
}
