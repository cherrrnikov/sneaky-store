package com.chernikov.sneaky_store.dto;

import com.chernikov.sneaky_store.dto.cart_item.CartItemDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private Long id;
    private Long userId;
    private Set<CartItemDTO> cartItems;
}
