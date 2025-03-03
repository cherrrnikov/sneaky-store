package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.auth.AuthResponse;
import com.chernikov.sneaky_store.dto.auth.LoginRequest;
import com.chernikov.sneaky_store.dto.auth.RegisterRequest;
import com.chernikov.sneaky_store.service.AuthService;
import com.chernikov.sneaky_store.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest registerRequest, HttpServletResponse response) throws Exception {
        return authService.register(registerRequest, response);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) throws Exception {
        return authService.login(loginRequest, response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String refreshToken = jwtUtil.extractTokenFromCookies(request, "refreshToken");

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        AuthResponse authResponse = authService.login(new LoginRequest(), response);

        if (authResponse != null) {
            return ResponseEntity.ok(authResponse);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @GetMapping
    public ResponseEntity<AuthResponse> checkAuth(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String accessToken = jwtUtil.extractTokenFromCookies(request, "accessToken");
        String refreshToken = jwtUtil.extractTokenFromCookies(request, "refreshToken");

        if (accessToken == null || refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (jwtUtil.isTokenValid(accessToken)) {
            Long userId = jwtUtil.extractUserId(accessToken);
            AuthResponse authResponse = authService.getUserData(userId);
            return ResponseEntity.ok(authResponse);
        }

        AuthResponse authResponse = authService.login(new LoginRequest(), response);

        if (authResponse != null) {
            return ResponseEntity.ok(authResponse);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

}
