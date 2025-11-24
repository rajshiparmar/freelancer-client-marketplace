package com.project.jwt;

import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtAuthenticationHelper jwtHelper;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String header = request.getHeader("Authorization");

		if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
		
			System.out.println("PROJECT-MS HEADER = " + request.getHeader("Authorization"));

		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			
		
			
			try {
				
				if (!jwtHelper.isTokenExpired(token)) {
					String email = jwtHelper.getEmailFromToken(token);
					String role = jwtHelper.getRoleFromToken(token);

					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, // principal
							null, 
							List.of(new SimpleGrantedAuthority(role)) 
					);
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
				
			} catch (Exception ex) {
			}
		}

		filterChain.doFilter(request, response);
	}
}
