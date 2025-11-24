package com.auth.service;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.auth.DTO.LoginRequest;
import com.auth.DTO.RegisterRequest;
import com.auth.entity.User;
import com.auth.exception.AlreadyExistsException;
import com.auth.exception.UserNotFoundException;
import com.auth.repository.UserRepository;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AuthenticationManager authenticationManager;

    public User login(LoginRequest loginRequest) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    );

            authenticationManager.authenticate(authToken);
        } catch (Exception e) {
            logger.warn("Invalid login attempt for email={}", loginRequest.getEmail());
            throw new RuntimeException("Invalid username or password");
        }

        return userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with email: " + loginRequest.getEmail()));
    }

    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AlreadyExistsException("User already exists with email: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        if ("CLIENT".equalsIgnoreCase(savedUser.getRole())) {
            String url = "http://localhost:8081/projects/clients";
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", savedUser.getId());
            try {
                restTemplate.postForObject(url, payload, Void.class);
                logger.info("Client registered in Project MS for userId={}", savedUser.getId());
            } catch (Exception e) {
                logger.error("Failed to register client in Project MS for userId={}: {}", savedUser.getId(), e.getMessage());
            }
        }

        if ("FREELANCER".equalsIgnoreCase(savedUser.getRole())) {
            String url = "http://localhost:8082/freelancer";
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", savedUser.getId());
            payload.put("name", savedUser.getName());
            payload.put("experienceLevel", "BEGINNER");
            try {
                restTemplate.postForObject(url, payload, Void.class);
                logger.info("Freelancer registered in Freelancer MS for userId={}", savedUser.getId());
            } catch (Exception e) {
                logger.error("Failed to register freelancer in Freelancer MS for userId={}: {}", savedUser.getId(), e.getMessage());
            }
        }

        return savedUser;
    }
}
