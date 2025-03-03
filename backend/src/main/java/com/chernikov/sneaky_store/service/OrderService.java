package com.chernikov.sneaky_store.service;

import com.chernikov.sneaky_store.dto.order.OrderCreateDTO;
import com.chernikov.sneaky_store.dto.order.OrderDTO;
import com.chernikov.sneaky_store.dto.order.OrderSummaryDTO;
import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderCreateDTO orderCreateDTO);

    OrderDTO getOrderById(Long orderId);

    List<OrderSummaryDTO> getAllOrders();

    List<OrderDTO> getAllOrdersWithDetails();

    void addToOrder(Long userId, OrderItemDTO orderItemDTO);

    void deleteFromOrder(Long userId, OrderItemDTO orderItemDTO);

    void deleteOrder(Long orderId);
}
