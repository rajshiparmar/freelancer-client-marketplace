package com.freelancer.entities;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_skill_freelancer",
       uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "freelancer_id"}))
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSkillFreelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "freelancer_id", nullable = false)
    private Long freelancerId;

    @Column(name = "match_score", nullable = false)
    private Double matchScore;

    @Column(name = "comment", length = 500)
    private String comment;

    @ManyToMany(cascade = CascadeType.ALL)
    Set<FreelancerSkill> matchingSkills;
}
