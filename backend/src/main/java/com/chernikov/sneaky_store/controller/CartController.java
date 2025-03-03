package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.CartDTO;
import com.chernikov.sneaky_store.dto.cart_item.CartItemCreateDTO;
import com.chernikov.sneaky_store.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Long userId) {
        CartDTO cartDTO = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartDTO);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Void> addToCart(@PathVariable Long userId, @RequestBody CartItemCreateDTO cartItemCreateDTO) {
        cartService.addToCart(userId, cartItemCreateDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/remove/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @PathVariable Long cartItemId) {
        cartService.removeFromCart(userId, cartItemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/remove/{cartItemId}/full")
    public ResponseEntity<Void> removeFromCartFull(@PathVariable Long userId, @PathVariable Long cartItemId) {
        cartService.removeFromCartFull(userId, cartItemId);
        return ResponseEntity.ok().build();
    }
}
