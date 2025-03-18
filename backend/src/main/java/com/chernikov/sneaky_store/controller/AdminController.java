package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.order.OrderDTO;
import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.service.AdminService;
import com.chernikov.sneaky_store.service.UserService;
import com.chernikov.sneaky_store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    private final AdminService adminService;
    private final UserService userService;
    private final ProductService productService;

    @Autowired
    public AdminController(AdminService adminService, UserService userService, ProductService productService) {
        this.adminService = adminService;
        this.userService = userService;
        this.productService = productService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> userDTOs = userService.getAllUsers();
        return userDTOs.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable("userId") Long userId) {
        List<OrderDTO> orders = adminService.getOrdersByUserId(userId);
        return orders.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(orders);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> productDTOs = productService.getAllProducts();
        return productDTOs.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(productDTOs);
    }
}
