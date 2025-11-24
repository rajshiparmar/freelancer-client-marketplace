package com.freelancer.DTO;

import java.util.List;

import lombok.Data;

@Data
public class SummaryDTO {
    private Long freelancerId;
    private String name;
    private List<String> skillNames;  
}
