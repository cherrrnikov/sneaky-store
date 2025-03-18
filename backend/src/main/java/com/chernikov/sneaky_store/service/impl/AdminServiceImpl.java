package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.dto.order.OrderDTO;
import com.chernikov.sneaky_store.entity.*;
import com.chernikov.sneaky_store.mapper.ProductMapper;
import com.chernikov.sneaky_store.mapper.UserMapper;
import com.chernikov.sneaky_store.mapper.order.OrderMapper;
import com.chernikov.sneaky_store.repository.CategoryRepository;
import com.chernikov.sneaky_store.repository.OrderRepository;
import com.chernikov.sneaky_store.repository.ProductRepository;
import com.chernikov.sneaky_store.repository.UserRepository;
import com.chernikov.sneaky_store.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public AdminServiceImpl(OrderRepository orderRepository, OrderMapper orderMapper, UserRepository userRepository, UserMapper userMapper) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(orderMapper::orderToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.valueOf(status.toUpperCase())); // Преобразуем строку в enum
        orderRepository.save(order);
    }

    public UserDTO updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        try {
            Role newRole = Role.valueOf(role.toUpperCase());

            if (user.getRoles().contains(newRole)) {
                // Если роль уже есть, удаляем её
                user.getRoles().remove(newRole);
            } else {
                // Если роли нет, добавляем её
                user.getRoles().add(newRole);
            }

            userRepository.save(user);
            return userMapper.userToUserDTO(user);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Недопустимая роль: " + role);
        }
    }


}
