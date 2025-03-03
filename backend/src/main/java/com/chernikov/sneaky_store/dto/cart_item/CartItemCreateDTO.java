package com.chernikov.sneaky_store.dto.cart_item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemCreateDTO {
    private Long id;
    private Long productID;
    private int quantity;
}
