package com.freelancer.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.freelancer.DTO.BidSummaryDTO;
import com.freelancer.DTO.BidsRequest;
import com.freelancer.DTO.BidsResponse;
import com.freelancer.DTO.SummaryDTO;
import com.freelancer.entities.Freelancer;
import com.freelancer.jwt.JwtAuthenticationHelper;
import com.freelancer.service.FreelancerService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/freelancer")
public class FreelancerController {

    private static final Logger logger = LoggerFactory.getLogger(FreelancerController.class);

    private final FreelancerService freelancerService;
    private final JwtAuthenticationHelper jwtHelper;

    public FreelancerController(FreelancerService freelancerService,
                                JwtAuthenticationHelper jwtHelper) {
        this.freelancerService = freelancerService;
        this.jwtHelper = jwtHelper;
    }

    // -------------------------------------------------------
    // POST: Add Bid
    // -------------------------------------------------------
    @PostMapping("/bids")
    @ResponseStatus(HttpStatus.CREATED)
    public BidsResponse addBid(@Valid @RequestBody BidsRequest req) {

        logger.info("ADD BID → projectId={}, freelancerId={}", req.getProjectId(), req.getFreelancerId());

        BidsResponse res = freelancerService.addBid(req);

        logger.info("ADD BID SUCCESS → bidId={}", res.getBidId());
        return res;
    }

    // -------------------------------------------------------
    // GET: Skills Summary for CLIENT
    // -------------------------------------------------------
    @GetMapping("/skills/summary")
    @ResponseStatus(HttpStatus.OK)
    public List<SummaryDTO> getSummary() {
        logger.info("Fetching freelancer skills summary");
        return freelancerService.getSummary();
    }

    // -------------------------------------------------------
    // POST: Create Freelancer (Called by Auth MS)
    // -------------------------------------------------------
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Freelancer createFreelancer(@RequestBody Freelancer freelancer) {
        logger.info("Creating new freelancer profile");
        return freelancerService.createFreelancer(freelancer);
    }

    // -------------------------------------------------------
    // GET: Bids for a Project (CLIENT)
    // -------------------------------------------------------
    @GetMapping("/bids/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public List<BidSummaryDTO> getBidsForProject(@PathVariable Long projectId) {

        logger.info("Fetching bids for projectId={}", projectId);
        return freelancerService.getBidsForProject(projectId);
    }

    // -------------------------------------------------------
    // GET: My Freelancer Profile (FREELANCER)
    // -------------------------------------------------------
    @GetMapping("/getFreelancer")
    @ResponseStatus(HttpStatus.OK)
    public Freelancer getMyFreelancer(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Long userId = jwtHelper.getUserIdFromToken(token);

        logger.info("Fetching freelancer profile for userId={}", userId);

        return freelancerService.getFreelancerByUserId(token);
    }

    // -------------------------------------------------------
    // GET: My Bids (FREELANCER)
    // -------------------------------------------------------
    @GetMapping("/my-bids")
    @ResponseStatus(HttpStatus.OK)
    public List<BidSummaryDTO> getMyBids(HttpServletRequest request) {

        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Long userId = jwtHelper.getUserIdFromToken(token);

        logger.info("Fetching bids placed by freelancer userId={}", userId);

        return freelancerService.getMyBids(token);
    }

    // -------------------------------------------------------
    // POST: Update Bid Status (CLIENT)
    // -------------------------------------------------------
    @PostMapping("/bids/{bidId}/status")
    @ResponseStatus(HttpStatus.OK)
    public String updateBidStatus(@PathVariable Long bidId,
                                  @RequestParam String status) {

        logger.info("Updating bid status for bidId={} to {}", bidId, status);

        freelancerService.updateBidStatus(bidId, status);

        return "Bid status updated to " + status;
    }

    // -------------------------------------------------------
    // GET: Get Freelancer by ID
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getFreelancerById(@PathVariable Long id) {
        try {
            logger.info("Fetching freelancer by id={}", id);
            Freelancer f = freelancerService.getFreelancerById(id);
            return ResponseEntity.ok(f);
        } catch (Exception e) {
            logger.error("Freelancer not found id={}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Freelancer not found", "id", id));
        }
    }
}
