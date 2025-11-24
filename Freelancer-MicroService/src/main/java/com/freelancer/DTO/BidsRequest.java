package com.freelancer.DTO;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BidsRequest {

	private Long projectId;

	private Long freelancerId;

	private BigDecimal bidAmount;

	private String message;

}
