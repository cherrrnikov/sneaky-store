package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.dto.auth.AuthResponse;
import com.chernikov.sneaky_store.dto.auth.LoginRequest;
import com.chernikov.sneaky_store.dto.auth.RegisterRequest;
import com.chernikov.sneaky_store.entity.Cart;
import com.chernikov.sneaky_store.entity.Role;
import com.chernikov.sneaky_store.entity.User;
import com.chernikov.sneaky_store.mapper.UserMapper;
import com.chernikov.sneaky_store.repository.CartRepository;
import com.chernikov.sneaky_store.repository.UserRepository;
import com.chernikov.sneaky_store.service.AuthService;
import com.chernikov.sneaky_store.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final CartRepository cartRepository;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, UserMapper userMapper, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userMapper = userMapper;
        this.cartRepository = cartRepository;
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest, HttpServletResponse response) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRoles(new HashSet<>(Collections.singletonList(Role.USER)));

        Cart cart = new Cart();
        cart.setUser(user);

        cartRepository.save(cart);

        user.setCart(cart);

        userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId(), user.getRoles());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getId());

        user.setAccessToken(accessToken);
        user.setRefreshToken(refreshToken);

        userRepository.save(user);

        jwtUtil.addTokenToCookies(response, accessToken, refreshToken);

        UserDTO userDTO = userMapper.userToUserDTO(user);

        return new AuthResponse(accessToken, refreshToken, userDTO);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User doesn't exist"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String accessToken = user.getAccessToken();
        String refreshToken = user.getRefreshToken();

        if (accessToken == null || !jwtUtil.isTokenValid(accessToken)) {
            if (refreshToken != null && jwtUtil.isTokenValid(refreshToken)) {
                accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId(), user.getRoles());

                user.setAccessToken(accessToken);
            } else {
                user.setAccessToken(null);
                user.setRefreshToken(null);
                userRepository.save(user);

                accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId(), user.getRoles());
                refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getId());

                user.setAccessToken(accessToken);
                user.setRefreshToken(refreshToken);
            }
            userRepository.save(user);
            jwtUtil.addTokenToCookies(response, accessToken, refreshToken);
        }

        System.out.println("ACCESS TOKEN: " + user.getAccessToken());
        System.out.println("REFRESH TOKEN: " + user.getRefreshToken());

        UserDTO userDTO = userMapper.userToUserDTO(user);
        return new AuthResponse(accessToken, refreshToken, userDTO);
    }


    @Override
    public AuthResponse getUserData(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User doesn't exist"));

        String accessToken = user.getAccessToken();
        String refreshToken = user.getRefreshToken();

        return new AuthResponse(accessToken, refreshToken, userMapper.userToUserDTO(user));
    }

}
