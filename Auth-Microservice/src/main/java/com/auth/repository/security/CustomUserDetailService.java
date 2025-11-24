package com.auth.repository.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.auth.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailService.class);

    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        logger.info("🔍 Loading user details for email={}", email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("❌ User not found with email={}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
    }
}

