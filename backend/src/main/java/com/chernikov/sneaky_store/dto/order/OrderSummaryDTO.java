package com.chernikov.sneaky_store.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderSummaryDTO {
    private Long id;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    private BigDecimal totalPrice;
    private String status;
}
