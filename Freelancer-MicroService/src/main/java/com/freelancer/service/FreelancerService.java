package com.freelancer.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.freelancer.DTO.BidSummaryDTO;
import com.freelancer.DTO.BidsRequest;
import com.freelancer.DTO.BidsResponse;
import com.freelancer.DTO.SkillRequestDTO;
import com.freelancer.DTO.SummaryDTO;
import com.freelancer.entities.Bid;
import com.freelancer.entities.BidStatus;
import com.freelancer.entities.Freelancer;
import com.freelancer.entities.FreelancerSkill;
import com.freelancer.exception.FreelancerNotFoundException;
import com.freelancer.jwt.JwtAuthenticationHelper;
import com.freelancer.repository.BidRepository;
import com.freelancer.repository.FreelancerRepository;
import com.freelancer.repository.FreelancerSkillRepository;

@Service
public class FreelancerService {

    private static final Logger logger = LoggerFactory.getLogger(FreelancerService.class);

    private final BidRepository bidRepository;
    private final FreelancerRepository freelancerRepository;
    private final FreelancerSkillRepository freelancerSkillRepository;
    private final JwtAuthenticationHelper jwtHelper;

    public FreelancerService(
            BidRepository bidRepository,
            FreelancerRepository freelancerRepository,
            FreelancerSkillRepository freelancerSkillRepository,
            JwtAuthenticationHelper jwtHelper
    ) {
        this.bidRepository = bidRepository;
        this.freelancerRepository = freelancerRepository;
        this.freelancerSkillRepository = freelancerSkillRepository;
        this.jwtHelper = jwtHelper;
    }

    // -----------------------------------------------------------------------
    // ADD BID
    // -----------------------------------------------------------------------
    public BidsResponse addBid(BidsRequest req) {

        logger.info("Adding bid → projectId={}, freelancerId={}", req.getProjectId(), req.getFreelancerId());

        Freelancer freelancer = freelancerRepository.findById(req.getFreelancerId())
                .orElseThrow(() -> new FreelancerNotFoundException("Freelancer not found"));

        Bid bid = new Bid();
        bid.setProjectId(req.getProjectId());
        bid.setFreelancer(freelancer);
        bid.setBidAmount(req.getBidAmount());
        bid.setMessage(req.getMessage());
        bid.setStatus(BidStatus.PENDING);

        Bid saved = bidRepository.save(bid);

        return new BidsResponse(saved.getId(), "Bid submitted successfully.", saved.getStatus().name());
    }

    // -----------------------------------------------------------------------
    // FREELANCER SKILLS SUMMARY FOR CLIENT
    // -----------------------------------------------------------------------
    public List<SummaryDTO> getSummary() {
        List<SummaryDTO> list = new ArrayList<>();
        List<Freelancer> freelancers = freelancerRepository.findAll();

        for (Freelancer f : freelancers) {

            SummaryDTO dto = new SummaryDTO();
            dto.setFreelancerId(f.getId());
            dto.setName(f.getName());

            List<FreelancerSkill> skills = freelancerSkillRepository.findByFreelancerId(f.getId());

            List<String> skillNames = new ArrayList<>();

            for (FreelancerSkill fs : skills) {
                skillNames.add(fs.getSkillName());
            }

            dto.setSkillNames(skillNames);
            list.add(dto);
        }
        return list;
    }
    
    // -----------------------------------------------------------------------
    // GET BIDS FOR SPECIFIC PROJECT (CLIENT)
    // -----------------------------------------------------------------------
    public List<BidSummaryDTO> getBidsForProject(Long projectId) {

        logger.info("Fetching bids for projectId={}", projectId);

        return bidRepository.findByProjectId(projectId)
                .stream()
                .map(bid -> {
                    BidSummaryDTO dto = new BidSummaryDTO();
                    dto.setBidId(bid.getId());
                    dto.setProjectId(bid.getProjectId());
                    dto.setFreelancerId(bid.getFreelancer().getId());
                    dto.setName(bid.getFreelancer().getName());
                    dto.setBidAmount(bid.getBidAmount());
                    dto.setMessage(bid.getMessage());
                    dto.setStatus(bid.getStatus().name());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // -----------------------------------------------------------------------
//    // GET FREELANCER PROFILE BY JWT
//    // -----------------------------------------------------------------------
    public Freelancer getFreelancerByUserId(String token) {

        Long userId = jwtHelper.getUserIdFromToken(token);
        logger.info("Fetching freelancer profile for userId={}", userId);

        return freelancerRepository.findByUserId(userId)
                .orElseThrow(() -> new FreelancerNotFoundException("Freelancer profile missing for userId=" + userId));
    }

    // -----------------------------------------------------------------------
    // CREATE FREELANCER (Called by Auth-MS)
    // -----------------------------------------------------------------------
    public Freelancer createFreelancer(Freelancer f) {
        logger.info("Creating new freelancer: {}", f.getName());
        return freelancerRepository.save(f);
    }

    // -----------------------------------------------------------------------
    // ADD / UPDATE SKILL
    // -----------------------------------------------------------------------
    public Freelancer addOrUpdateSkill(SkillRequestDTO dto) {

        logger.info("Adding skill='{}' for freelancerId={}", dto.getSkillName(), dto.getFreelancerId());

        Freelancer freelancer = freelancerRepository.findById(dto.getFreelancerId())
                .orElseThrow(() -> new FreelancerNotFoundException("Invalid Freelancer ID"));

        Optional<FreelancerSkill> existing =
                freelancerSkillRepository.findByFreelancerIdAndSkillNameIgnoreCase(
                        dto.getFreelancerId(), dto.getSkillName());

        if (existing.isPresent()) {
            logger.info("Skill '{}' already exists for freelancerId={}", dto.getSkillName(), dto.getFreelancerId());
            return freelancer;
        }

        FreelancerSkill skill = new FreelancerSkill();
        skill.setFreelancer(freelancer);
        skill.setSkillName(dto.getSkillName());

        freelancer.getSkills().add(skill);
        return freelancerRepository.save(freelancer);
    }

    // -----------------------------------------------------------------------
    // GET MY BIDS (FREELANCER)
    // -----------------------------------------------------------------------
    public List<BidSummaryDTO> getMyBids(String token) {

        Long userId = jwtHelper.getUserIdFromToken(token);
        logger.info("Fetching bids for freelancer userId={}", userId);

        Freelancer freelancer = freelancerRepository.findByUserId(userId)
                .orElseThrow(() -> new FreelancerNotFoundException("Freelancer not found"));

        return bidRepository.findByFreelancerId(freelancer.getId())
                .stream()
                .map(bid -> {
                    BidSummaryDTO dto = new BidSummaryDTO();
                    dto.setFreelancerId(freelancer.getId());
                    dto.setName(freelancer.getName());
                    dto.setBidAmount(bid.getBidAmount());
                    dto.setMessage(bid.getMessage());
                    dto.setStatus(bid.getStatus().name());
                    dto.setProjectId(bid.getProjectId());
                    dto.setBidId(bid.getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // -----------------------------------------------------------------------
    // UPDATE BID STATUS (ACCEPT / REJECT)
    // -----------------------------------------------------------------------
    public void updateBidStatus(Long bidId, String status) {

        logger.info("Updating bidStatus for bidId={} → {}", bidId, status);

        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        if (!status.equalsIgnoreCase("ACCEPTED") &&
            !status.equalsIgnoreCase("REJECTED"))
            throw new RuntimeException("Invalid status");

        bid.setStatus(BidStatus.valueOf(status.toUpperCase()));
        bidRepository.save(bid);
    }

    // -----------------------------------------------------------------------
    // GET FREELANCER BY ID
    // -----------------------------------------------------------------------
    public Freelancer getFreelancerById(Long id) {

        logger.info("Fetching freelancer by id={}", id);

        return freelancerRepository.findById(id)
                .orElseThrow(() -> new FreelancerNotFoundException("Freelancer not found with id=" + id));
    }
    
    public BidSummaryDTO getBidInfo(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        BidSummaryDTO dto = new BidSummaryDTO();
        dto.setBidId(bid.getId());
        dto.setFreelancerId(bid.getFreelancer().getId());
        dto.setProjectId(bid.getProjectId());
        return dto;
    }

}
