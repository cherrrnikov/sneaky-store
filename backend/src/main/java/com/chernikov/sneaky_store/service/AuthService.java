package com.chernikov.sneaky_store.service;

import com.chernikov.sneaky_store.dto.auth.AuthResponse;
import com.chernikov.sneaky_store.dto.auth.LoginRequest;
import com.chernikov.sneaky_store.dto.auth.RegisterRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest, HttpServletResponse response);

    AuthResponse login(LoginRequest loginRequest, HttpServletResponse response);

    AuthResponse getUserData(Long userId);
}
