package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.order_item.OrderItemCreateDTO;
import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;
import com.chernikov.sneaky_store.entity.Order;
import com.chernikov.sneaky_store.entity.OrderItem;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemCreateMapper;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemMapper;
import com.chernikov.sneaky_store.repository.OrderItemRepository;
import com.chernikov.sneaky_store.repository.OrderRepository;
import com.chernikov.sneaky_store.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrderItemServiceImpl implements OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemMapper orderItemMapper;
    private final OrderItemCreateMapper orderItemCreateMapper;

    @Autowired
    public OrderItemServiceImpl(OrderItemRepository orderItemRepository, OrderRepository orderRepository, OrderItemMapper orderItemMapper, OrderItemCreateMapper orderItemCreateMapper) {
        this.orderItemRepository = orderItemRepository;
        this.orderItemMapper = orderItemMapper;
        this.orderItemCreateMapper = orderItemCreateMapper;
        this.orderRepository = orderRepository;
    }

    @Override
    public OrderItemDTO createOrderItem(OrderItemCreateDTO orderItemCreateDTO, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        OrderItem orderItem = orderItemCreateMapper.orderItemCreateDTOToOrderItem(orderItemCreateDTO);
        orderItem.setOrder(order);
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        return orderItemMapper.orderItemToOrderItemDTO(savedOrderItem);
    }

    @Override
    public List<OrderItemDTO> getOrderItemsByOrderId(Long orderId) {
        List<OrderItem> orderItems = (List<OrderItem>) orderItemRepository.findByOrderId(orderId);
        return orderItems.stream()
                .map(orderItemMapper::orderItemToOrderItemDTO)
                .toList();
    }

    @Override
    public void deleteOrderItem(Long orderItemId) {
        if (!orderItemRepository.existsById(orderItemId)) {
            throw new RuntimeException("Order item not found");
        }
        orderItemRepository.deleteById(orderItemId);
    }
}
