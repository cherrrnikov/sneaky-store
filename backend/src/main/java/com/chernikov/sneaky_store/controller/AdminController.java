package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.entity.Role;
import com.chernikov.sneaky_store.service.UserService;
import com.chernikov.sneaky_store.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AdminController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/assignRole/{userId}")
    public ResponseEntity<?> assignRole(
            @PathVariable Long userId,
            @RequestParam Role role,
            @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            UserDTO updatedUser = userService.assignRole(userId, role, email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/removeRole/{userId}")
    public ResponseEntity<?> removeRole(
            @PathVariable Long userId,
            @RequestParam Role role,
            @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            UserDTO updatedUser = userService.removeRole(userId, role, email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/clearRoles/{userId}")
    public ResponseEntity<?> clearRoles(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            UserDTO updatedUser = userService.clearRoles(userId, email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}

