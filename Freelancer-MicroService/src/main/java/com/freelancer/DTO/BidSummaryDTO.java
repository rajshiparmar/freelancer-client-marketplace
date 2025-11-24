package com.freelancer.DTO;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BidSummaryDTO {
	 private Long bidId;
	 private Long projectId; 
    private Long freelancerId;
    private String name;
    private BigDecimal bidAmount;
    private String message;
    private String status;
}
