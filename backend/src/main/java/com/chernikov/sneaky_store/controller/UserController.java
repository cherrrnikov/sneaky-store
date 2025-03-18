package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return userDTO != null ? ResponseEntity.ok(userDTO) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable("id") Long id, @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}/like/{productId}")
    public ResponseEntity<Void> addProductToLiked(@PathVariable("userId") Long userId, @PathVariable("productId") Long productId) {
        userService.addProductToLiked(userId, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/like/{productId}")
    public ResponseEntity<Void> removeProductFromLiked(@PathVariable("userId") Long userId, @PathVariable("productId") Long productId) {
        userService.removeProductFromLiked(userId, productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/liked")
    public ResponseEntity<List<ProductDTO>> getLikedProducts(@PathVariable("userId") Long userId) {
        List<ProductDTO> productDTOs = userService.getLikedProducts(userId);
        return productDTOs.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(productDTOs);
    }
}
