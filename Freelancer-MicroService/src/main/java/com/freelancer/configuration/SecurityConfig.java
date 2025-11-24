package com.freelancer.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import com.freelancer.jwt.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable()
                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/freelancer").permitAll()


                     // CLIENT must match BEFORE freelancer wildcard rule
                        .requestMatchers("/freelancer/skills/summary").hasAuthority("CLIENT")
                        .requestMatchers("/freelancer/bids/**").hasAuthority("CLIENT")

                        // Freelancer access
                        .requestMatchers("/freelancer/getFreelancer").hasAuthority("FREELANCER")
                        .requestMatchers("/freelancer/bids").hasAuthority("FREELANCER")
                        .requestMatchers("/freelancer/my-bids").hasAuthority("FREELANCER")
                        .requestMatchers("/freelancer/skills/**").hasAuthority("FREELANCER") 


                        .requestMatchers(HttpMethod.GET, "/freelancer/*")
                                .hasAnyAuthority("CLIENT", "FREELANCER")

                        .anyRequest().authenticated()
                )
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
