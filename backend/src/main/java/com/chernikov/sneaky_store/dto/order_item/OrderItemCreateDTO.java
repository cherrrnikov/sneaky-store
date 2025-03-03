package com.chernikov.sneaky_store.dto.order_item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemCreateDTO {
    private Long productID;
    private int quantity;
}
