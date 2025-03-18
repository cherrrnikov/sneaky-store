package com.chernikov.sneaky_store.service;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.dto.order.OrderDTO;
import com.chernikov.sneaky_store.entity.OrderStatus;

import java.util.List;

public interface AdminService {
    List<OrderDTO> getOrdersByUserId(Long userId);
    void updateOrderStatus(Long orderId, String status);
    UserDTO updateUserRole(Long userId, String role);
}