package com.chernikov.sneaky_store.dto.order;

import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userID;
    private List<OrderItemDTO> orderItems;
    private String deliveryAddress;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    private BigDecimal totalPrice;
    private String status;
}
