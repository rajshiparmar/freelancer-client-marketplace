package com.project.entities;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Project {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column
	private String title;

	@Column
	private String description;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "client_Id", nullable = false)
	@JsonIgnore
	private Client client;

	@Column(precision = 20, scale = 2)
	private BigDecimal budget;


	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ProjectStatus status;

	@OneToMany( cascade = CascadeType.ALL , orphanRemoval = true)
	@JoinColumn(name = "project_id")
	private Set<Skill> skills = new HashSet<>();
	
	
	
	
	@Column
	private Long assignedFreelancerId;

	@Column
	private String assignedFreelancerName;

	@Enumerated(EnumType.STRING)
	private AssignmentStatus assignmentStatus;  // PENDING, ASSIGNED, REJECTED

}
