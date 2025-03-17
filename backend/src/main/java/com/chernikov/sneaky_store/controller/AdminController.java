package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.entity.OrderStatus;
import com.chernikov.sneaky_store.entity.Role;
import com.chernikov.sneaky_store.entity.Product;
import com.chernikov.sneaky_store.service.AdminService;
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
    private final AdminService adminService; // Новая зависимость для админских операций
    private final JwtUtil jwtUtil;

    @Autowired
    public AdminController(UserService userService, AdminService adminService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.adminService = adminService;
        this.jwtUtil = jwtUtil;
    }

    // 1. Управление ролями пользователей
    @PostMapping("/assignRole/{userId}")
    public ResponseEntity<?> assignRole(@PathVariable Long userId, @RequestParam Role role, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            UserDTO updatedUser = userService.assignRole(userId, role, email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/removeRole/{userId}")
    public ResponseEntity<?> removeRole(@PathVariable Long userId, @RequestParam Role role, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            UserDTO updatedUser = userService.removeRole(userId, role, email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/clearRoles/{userId}")
    public ResponseEntity<?> clearRoles(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            UserDTO updatedUser = userService.clearRoles(userId, email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 2. Управление товарами
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            ProductDTO newProduct = adminService.addProduct(productDTO, email);
            return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/product/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Long productId, @RequestBody ProductDTO productDTO, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            ProductDTO updatedProduct = adminService.updateProduct(productId, productDTO, email);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            adminService.deleteProduct(productId, email);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 3. Управление категориями
    @PostMapping("/category")
    public ResponseEntity<?> addCategory(@RequestBody String categoryName, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            adminService.addCategory(categoryName, email);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/category/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            adminService.deleteCategory(categoryId, email);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 4. Управление брендами
    @PostMapping("/brand")
    public ResponseEntity<?> addBrand(@RequestBody String brandName, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            adminService.addBrand(brandName, email);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/brand")
    public ResponseEntity<?> deleteBrand(@RequestParam String brandName, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            adminService.deleteBrand(brandName, email);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 5. Управление пользователями
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            adminService.deleteUser(userId, email);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 6. Управление заказами
    @PutMapping("/order/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status, @RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        try {
            adminService.updateOrderStatus(orderId, status, email);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
