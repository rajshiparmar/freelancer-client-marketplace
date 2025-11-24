package com.auth.controller;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.auth.DTO.LoginRequest;
import com.auth.DTO.LoginResponse;
import com.auth.DTO.RegisterRequest;
import com.auth.DTO.RegisterResponse;
import com.auth.entity.User;
import com.auth.jwt.JwtAuthenticationHelper;
import com.auth.service.AuthService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	@Autowired
	AuthService authService;
	
    @Autowired
    private JwtAuthenticationHelper jwtHelper;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
    	
    	  logger.info("Login attempt for email={} correlationId={}", 
                  request.getEmail(), MDC.get("correlationId"));

    	
        User user = authService.login(request);
        
        logger.info("Login successful for userId={} correlationId={}", 
                user.getId(), MDC.get("correlationId"));
        
        String token = jwtHelper.generateToken(user);

        LoginResponse response = new LoginResponse(token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest request) {
    	  logger.info("Register attempt for email={} correlationId={}", 
                  request.getEmail(), MDC.get("correlationId"));

    	
        User user = authService.register(request);
        
        logger.info("User registered successfully userId={} correlationId={}", 
                user.getId(), MDC.get("correlationId"));

        
        String token = jwtHelper.generateToken(user);

        RegisterResponse response = new RegisterResponse(
                "User registered successfully.",
                user.getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
