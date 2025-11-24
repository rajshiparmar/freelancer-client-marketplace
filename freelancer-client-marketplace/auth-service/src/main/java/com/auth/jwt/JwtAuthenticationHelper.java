package com.auth.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.auth.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtAuthenticationHelper {

    @Value("${jwt.secrets}")
    private String secret;

    @Value("${jwt.expiration}")
    private long JWT_TOKEN_VALIDITY;

    public String getUsernameFromToken(String token){
        Claims claims =  getClaimsFromToken(token);
        return claims.getSubject();
    }

    public Claims getClaimsFromToken(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secret.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims;
    }

    public Boolean isTokenExpired(String token){
        Claims claims =  getClaimsFromToken(token);
        Date expDate = claims.getExpiration();
        return expDate.before(new Date());
    }

    public Boolean validateToken(String token, String email) {
        final String extractedEmail = getUsernameFromToken(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    public String generateToken(User user) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", user.getRole());
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+JWT_TOKEN_VALIDITY))
                .signWith(new SecretKeySpec(secret.getBytes(), "HmacSHA512"))
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        return getClaimsFromToken(token).get("userId", Long.class);
    }

    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }
}
