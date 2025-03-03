package com.chernikov.sneaky_store.service;


import com.chernikov.sneaky_store.dto.CartDTO;
import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.cart_item.CartItemCreateDTO;

import java.util.List;

public interface CartService {
    CartDTO getCartByUserId(Long userId);

    void addToCart(Long userId, CartItemCreateDTO cartItemCreateDTO);

    void removeFromCart(Long userId, Long cartItemId);

    void removeFromCartFull(Long userId, Long cartItemId);
}
