package com.matrixcare.service;

import com.matrixcare.entity.User;
import com.matrixcare.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Value("${jwt.secret:mySecretKey12345678901234567890123456789012345678901234567890}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400}") // 24 hours in seconds
    private Long jwtExpiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public User registerUser(User user) {
        // Check if user already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Save user
        return userRepository.save(user);
    }
    
    public Map<String, Object> loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        
        User user = userOptional.get();
        
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", sanitizeUser(user));
        response.put("expiresIn", jwtExpiration);
        
        return response;
    }
    
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().toString());
        claims.put("fullName", user.getFullName());
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token");
        }
    }
    
    public String extractEmailFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }
    
    public Long extractUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return Long.valueOf(claims.get("userId").toString());
    }
    
    public User getCurrentUser(String token) {
        String email = extractEmailFromToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public boolean isTokenValid(String token) {
        try {
            validateToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private Map<String, Object> sanitizeUser(User user) {
        Map<String, Object> sanitizedUser = new HashMap<>();
        sanitizedUser.put("id", user.getId());
        sanitizedUser.put("firstName", user.getFirstName());
        sanitizedUser.put("lastName", user.getLastName());
        sanitizedUser.put("email", user.getEmail());
        sanitizedUser.put("hospital", user.getHospital());
        sanitizedUser.put("specialty", user.getSpecialty());
        sanitizedUser.put("licenseNumber", user.getLicenseNumber());
        sanitizedUser.put("role", user.getRole());
        sanitizedUser.put("fullName", user.getFullName());
        // Note: Password is intentionally excluded
        return sanitizedUser;
    }
} 