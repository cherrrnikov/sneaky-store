package com.chernikov.sneaky_store.dto.order;

import com.chernikov.sneaky_store.dto.order_item.OrderItemCreateDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreateDTO {
    private Long userID;
    private String deliveryAddress;
    private List<OrderItemCreateDTO> orderItems;
}
