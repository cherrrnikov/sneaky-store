package com.chernikov.sneaky_store.service;

import com.chernikov.sneaky_store.dto.order_item.OrderItemCreateDTO;
import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;

import java.util.List;

public interface OrderItemService {
    OrderItemDTO createOrderItem(OrderItemCreateDTO orderItemCreateDTO, Long orderId);

    List<OrderItemDTO> getOrderItemsByOrderId(Long orderId);

    void deleteOrderItem(Long orderItemId);
}
