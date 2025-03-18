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

        @Autowired
        public AdminServiceImpl(OrderRepository orderRepository, OrderMapper orderMapper) {
            this.orderRepository = orderRepository;
            this.orderMapper = orderMapper;
        }

        @Override
        public List<OrderDTO> getOrdersByUserId(Long userId) {
            List<Order> orders = orderRepository.findByUserId(userId);
            return orders.stream()
                    .map(orderMapper::orderToOrderDTO)
                    .collect(Collectors.toList());
        }
}
