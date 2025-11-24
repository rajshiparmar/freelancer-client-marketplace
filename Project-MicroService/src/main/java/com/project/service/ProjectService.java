package com.project.service;

import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.DTO.CreateProjectRequest;
import com.project.DTO.CreateProjectResponse;
import com.project.DTO.FreelancerMatch;
import com.project.DTO.ProjectAssignmentDTO;
import com.project.entities.*;
import com.project.exception.ClientNotFoundException;
import com.project.jwt.JwtAuthenticationHelper;
import com.project.repository.*;

@Service
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final JwtAuthenticationHelper jwtHelper;
    private final RestTemplate restTemplate;

    public ProjectService(ClientRepository clientRepository,
                          ProjectRepository projectRepository,
                          SkillRepository skillRepository,
                          ProjectAssignmentRepository assignmentRepository,
                          JwtAuthenticationHelper jwtHelper,
                          RestTemplate restTemplate) {

        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.assignmentRepository = assignmentRepository;
        this.jwtHelper = jwtHelper;
        this.restTemplate = restTemplate;
    }

    // --------------------------------------------------------
    // CREATE PROJECT
    // --------------------------------------------------------
    public CreateProjectResponse createProject(CreateProjectRequest request, String token) {

        Long userId = jwtHelper.getUserIdFromToken(token.replace("Bearer ", ""));

        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new ClientNotFoundException("Client not found!"));

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setClient(client);
        project.setStatus(ProjectStatus.OPEN);

        Project saved = projectRepository.save(project);

        // save skills
        request.getRequiredSkillNames().forEach(name -> {
            Skill s = new Skill();
            s.setSkillname(name);
            saved.getSkills().add(s);
        });

        projectRepository.save(saved);

        return new CreateProjectResponse(saved.getId(), "Project created successfully");
    }

    // --------------------------------------------------------
    // MATCH FREELANCERS FOR A PROJECT
    // --------------------------------------------------------
    public List<FreelancerMatch> getMatchesById(Long id, String token) {

	    // 1. Load project
	    Project project = projectRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Project not found"));

	    // 2. Extract required skill names from project
	    List<String> requiredSkillNames = project.getSkills().stream()
	            .map(Skill::getSkillname)
	            .toList();

	    // 3. Get freelancer summaries from freelancer service
	    HttpHeaders headers = new HttpHeaders();
	    headers.set("Authorization", token);
	    HttpEntity<Void> entity = new HttpEntity<>(headers);

	    String url = "http://localhost:8082/freelancer/skills/summary";

	    Map[] freelancers = restTemplate.exchange(
	            url,
	            HttpMethod.GET,
	            entity,
	            Map[].class
	    ).getBody();

	    List<FreelancerMatch> result = new ArrayList<>();

	    // 4. For each freelancer → calculate match score
	    for (Map f : freelancers) {

	        Long freelancerId = ((Number) f.get("freelancerId")).longValue();
	        String name = (String) f.get("name");

	        List<String> freelancerSkills = (List<String>) f.get("skillNames");

	        long matchedCount = freelancerSkills.stream()
	                .filter(requiredSkillNames::contains)
	                .count();

	        double score = requiredSkillNames.isEmpty() ?
	                0.0 : (double) matchedCount / requiredSkillNames.size();

	        FreelancerMatch fm = new FreelancerMatch();
	        fm.setFreelancerId(freelancerId);
	        fm.setName(name);
	        fm.setMatchScore(score);

	        result.add(fm);
	    }

	    return result;
	}
    
    // --------------------------------------------------------
    // GET MY PROJECTS
    // --------------------------------------------------------
    public List<Project> getMyProjects(String token) {

        Long userId = jwtHelper.getUserIdFromToken(token.replace("Bearer ", ""));

        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new ClientNotFoundException("Client not found"));

        return projectRepository.findByClient_Id(client.getId());
    }

    // --------------------------------------------------------
    // GET PROJECT BY ID
    // --------------------------------------------------------
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    // --------------------------------------------------------
    // GET ALL
    // --------------------------------------------------------
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // --------------------------------------------------------
    // GET PROJECT BIDS
    // --------------------------------------------------------
    public List<Object> getProjectBids(Long projectId, String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token.replace("Bearer ", ""));

        String url = "http://localhost:8082/freelancer/bids/" + projectId;

        ResponseEntity<List<Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<List<Object>>() {}
        );

        return response.getBody();
    }

    // --------------------------------------------------------
    // ACCEPT / REJECT BID + SAVE ASSIGNMENT
    // --------------------------------------------------------
    public void updateBidDecision(Long projectId, Long bidId, String status, String token) {

        // -----------------------------
        // 1. Update freelancer-ms status
        // -----------------------------
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token.replace("Bearer ", ""));
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        restTemplate.postForEntity(
                "http://localhost:8082/freelancer/bids/" + bidId + "/status?status=" + status,
                entity,
                Void.class
        );

        // -----------------------------
        // 2. Determine assignment status
        // -----------------------------
        AssignmentStatus assignStatus =
                status.equalsIgnoreCase("ACCEPTED") ? AssignmentStatus.ASSIGNED :
                status.equalsIgnoreCase("REJECTED") ? AssignmentStatus.REJECTED :
                AssignmentStatus.PENDING;

        // -----------------------------
        // 3. Fetch freelancerId from freelancer-MS
        // -----------------------------
        ResponseEntity<Map> bidResponse = restTemplate.exchange(
            "http://localhost:8082/freelancer/bids/info/" + bidId,
            HttpMethod.GET,
            entity,
            Map.class
        );

        Long freelancerId =
                ((Number) bidResponse.getBody().get("freelancerId")).longValue();

        // -----------------------------
        // 4. Prevent duplicate assignment
        // -----------------------------
        Optional<ProjectAssignment> existing =
                assignmentRepository.findByProjectIdAndFreelancerId(projectId, freelancerId);

        ProjectAssignment assignment;

        if (existing.isPresent()) {
            // update existing assignment
            assignment = existing.get();
            assignment.setStatus(assignStatus);
        } else {
            // create new assignment
            assignment = ProjectAssignment.builder()
                    .projectId(projectId)
                    .freelancerId(freelancerId)
                    .status(assignStatus)
                    .build();
        }

        assignmentRepository.save(assignment);
    }

    
    // --------------------------------------------------------
    // GET ASSIGNMENT
    // --------------------------------------------------------
    public List<ProjectAssignmentDTO> getAssignedProjects(Long clientId, String token) {
	    try {
	        List<Project> projects = projectRepository.findByClient_Id(clientId);
	        List<Long> projectIds = projects.stream()
	                .map(Project::getId)
	                .toList();

	        List<ProjectAssignment> assignments = assignmentRepository.findByProjectIdIn(projectIds);
	        List<ProjectAssignmentDTO> result = new ArrayList<>();

	        HttpHeaders headers = new HttpHeaders();
	        headers.set("Authorization", "Bearer " + token);
	        HttpEntity<Void> entity = new HttpEntity<>(headers);

	        for (ProjectAssignment a : assignments) {
	            if (a.getStatus() != AssignmentStatus.ASSIGNED) continue;

	            try {
	                Project p = projectRepository.findById(a.getProjectId())
	                        .orElseThrow(() -> new RuntimeException("Project not found: " + a.getProjectId()));
	                
	                String url = "http://localhost:8082/freelancer/" + a.getFreelancerId();
	                
	                ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
	                
	                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
	                    Map<String, Object> freelancerData = response.getBody();
	                    String freelancerName = extractFreelancerName(freelancerData);
	                    
	                    ProjectAssignmentDTO dto = new ProjectAssignmentDTO();
	                    dto.setAssignmentId(a.getId());
	                    dto.setProjectId(p.getId());
	                    dto.setProjectTitle(p.getTitle());
	                    dto.setFreelancerId(a.getFreelancerId());
	                    dto.setFreelancerName(freelancerName);
	                    dto.setStatus(a.getStatus().name());
	                    
	                    result.add(dto);
	                } else {
	                    logger.warn("Failed to fetch freelancer data for id: {}", a.getFreelancerId());
	                }
	                
	            } catch (Exception e) {
	                logger.error("Error processing assignment: {}", a.getId(), e);
	            }
	        }
	        return result;
	        
	    } catch (Exception e) {
	        logger.error("Error in getAssignedProjects for clientId: {}", clientId, e);
	        throw new RuntimeException("Failed to fetch assigned projects", e);
	    }
	}

	private String extractFreelancerName(Map<String, Object> freelancerData) {
	    try {

	        if (freelancerData.get("name") != null) {
	            return freelancerData.get("name").toString();
	        } else if (freelancerData.get("fullName") != null) {
	            return freelancerData.get("fullName").toString();
	        } else if (freelancerData.get("username") != null) {
	            return freelancerData.get("username").toString();
	        }
	        return "Unknown";
	    } catch (Exception e) {
	        logger.warn("Failed to extract freelancer name from response: {}", freelancerData);
	        return "Unknown";
	    }
	}
}
