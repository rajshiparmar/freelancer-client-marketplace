package com.project.controller;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.DTO.CreateProjectRequest;
import com.project.DTO.CreateProjectResponse;
import com.project.DTO.FreelancerMatch;
import com.project.DTO.ProjectAssignmentDTO;
import com.project.entities.Client;
import com.project.entities.Project;
import com.project.exception.ClientNotFoundException;
import com.project.jwt.JwtAuthenticationHelper;
import com.project.repository.ClientRepository;
import com.project.repository.ProjectRepository;
import com.project.service.ProjectService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectService projectService;
    
    @Autowired
    JwtAuthenticationHelper authenticationHelper;
    
    @Autowired
    ClientRepository clientRepository;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // --------------------------------------------------------
    // CREATE PROJECT
    // --------------------------------------------------------
    @PostMapping
    public ResponseEntity<CreateProjectResponse> createProject(
            @RequestBody CreateProjectRequest req,
            HttpServletRequest request) {

        String token = request.getHeader("Authorization");
        CreateProjectResponse response = projectService.createProject(req, token);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --------------------------------------------------------
    // SKILL MATCHING FOR A PROJECT
    // --------------------------------------------------------
	
	@GetMapping("/{id}/matches")
	public ResponseEntity<List<FreelancerMatch>> getMatchesById(@PathVariable Long id, HttpServletRequest request){
		
        logger.info("Match request received for projectId={}", id);
		
		String token = request.getHeader("Authorization");
		  List<FreelancerMatch> freelancerMatch = projectService.getMatchesById(id,token);
		
		  logger.info("Match result returned with {} freelancers", freelancerMatch.size());
		  
		return ResponseEntity.ok(freelancerMatch);
	}
	
    // --------------------------------------------------------
    // GET MY PROJECTS (CLIENT)
    // --------------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<List<Project>> getMyProjects(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return ResponseEntity.ok(projectService.getMyProjects(token));
    }

    // --------------------------------------------------------
    // GET PROJECT BY ID
    // --------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    // --------------------------------------------------------
    // GET ALL PROJECTS
    // --------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Project>> getAll() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // --------------------------------------------------------
    // GET BIDS FOR A PROJECT
    // --------------------------------------------------------
    @GetMapping("/{projectId}/bids")
    public ResponseEntity<List<Object>> getProjectBids(
            @PathVariable Long projectId,
            HttpServletRequest request) {

        String token = request.getHeader("Authorization");
        return ResponseEntity.ok(projectService.getProjectBids(projectId, token));
    }

    // --------------------------------------------------------
    // ACCEPT / REJECT BID
    // --------------------------------------------------------
    @PostMapping("/{projectId}/bids/{bidId}/status")
    public ResponseEntity<String> updateBid(
            @PathVariable Long projectId,
            @PathVariable Long bidId,
            @RequestParam String status,
            HttpServletRequest request) {

        String token = request.getHeader("Authorization");
        projectService.updateBidDecision(projectId, bidId, status, token);

        return ResponseEntity.ok("Bid " + status + " successfully");
    }

    // --------------------------------------------------------
    // GET ASSIGNED PROJECTS FOR CLIENT
    // --------------------------------------------------------
	@GetMapping("/assigned")
	public ResponseEntity<List<ProjectAssignmentDTO>> getAssignedProjects(HttpServletRequest request) {

	    String token = request.getHeader("Authorization").replace("Bearer ", "");
	    Long userId = authenticationHelper.getUserIdFromToken(token);

	    Client client = clientRepository.findByUserId(userId)
	            .orElseThrow(() -> new RuntimeException("Client not found"));

	    System.out.println("👉 Logged-in clientId = " + client.getId());

	    List<ProjectAssignmentDTO> list =
	            projectService.getAssignedProjects(client.getId(), token);

	    return ResponseEntity.ok(list);
	}
}
