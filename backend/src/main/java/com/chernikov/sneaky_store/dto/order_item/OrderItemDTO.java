package com.chernikov.sneaky_store.dto.order_item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long orderID;
    private Long productID;
    private String productName;
    private int quantity;
    private BigDecimal price;
}
