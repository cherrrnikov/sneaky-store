package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.order.OrderCreateDTO;
import com.chernikov.sneaky_store.dto.order.OrderDTO;
import com.chernikov.sneaky_store.dto.order.OrderSummaryDTO;
import com.chernikov.sneaky_store.dto.order_item.OrderItemCreateDTO;
import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;
import com.chernikov.sneaky_store.entity.*;
import com.chernikov.sneaky_store.mapper.order.OrderCreateMapper;
import com.chernikov.sneaky_store.mapper.order.OrderMapper;
import com.chernikov.sneaky_store.mapper.order.OrderSummaryMapper;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemCreateMapper;
import com.chernikov.sneaky_store.repository.CartRepository;
import com.chernikov.sneaky_store.repository.OrderRepository;
import com.chernikov.sneaky_store.repository.ProductRepository;
import com.chernikov.sneaky_store.service.CartService;
import com.chernikov.sneaky_store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderSummaryMapper orderSummaryMapper;
    private final OrderCreateMapper orderCreateMapper;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderMapper orderMapper,
                            OrderSummaryMapper orderSummaryMapper,
                            OrderCreateMapper orderCreateMapper,
                            CartService cartService,
                            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.orderSummaryMapper = orderSummaryMapper;
        this.orderCreateMapper = orderCreateMapper;
        this.cartService = cartService;
        this.productRepository = productRepository;
    }

    @Override
    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO) {
        Order order = orderCreateMapper.orderCreateDTOToOrder(orderCreateDTO);
        order.setOrderDate(LocalDateTime.now());

        order.getOrderItems().forEach(orderItem -> {
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Убедитесь, что цена и название товара корректно присваиваются
            orderItem.setProduct(product);
            orderItem.setPrice(product.getPrice());
        });

        // Если цена заказа не рассчитывается в других местах, посчитайте её вручную
        BigDecimal totalPrice = order.getOrderItems().stream()
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalPrice(totalPrice);

        order.getOrderItems().forEach(orderItem -> {
            orderItem.setOrder(order);
        });

        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        cartService.clearCart(orderCreateDTO.getUserID());

        return orderMapper.orderToOrderDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(orderMapper::orderToOrderDTO)
                .orElse(null);
    }

    @Override
    public List<OrderSummaryDTO> getAllOrders() {
        return ((List<Order>) orderRepository.findAll())
                .stream()
                .map(orderSummaryMapper::orderToOrderSummaryDTO)
                .toList();
    }

    @Override
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(orderMapper::orderToOrderDTO)
                .toList();
    }

    @Override
    public List<OrderDTO> getAllOrdersWithDetails() {
        List<Order> orders = (List<Order>) orderRepository.findAll();
        return orders.stream()
                .map(orderMapper::orderToOrderDTO)
                .toList();
    }

    @Override
    public void addToOrder(Long userId, OrderItemDTO orderItemDTO) {
        // Получаем заказ по userId
        Order order = orderRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Получаем продукт по ID
        Product product = productRepository.findById(orderItemDTO.getProductID())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Создаем новый OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);  // Связываем с продуктом через его объект
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setPrice(orderItemDTO.getPrice());

        // Добавляем OrderItem в заказ
        order.getOrderItems().add(orderItem);

        // Обновляем общую стоимость заказа
        order.setTotalPrice(order.getTotalPrice().add(orderItem.getPrice()));

        // Сохраняем изменения в заказе
        orderRepository.save(order);
    }


    @Override
    public void deleteFromOrder(Long orderId, OrderItemDTO orderItemDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getProduct().getId().equals(orderItemDTO.getProductID()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        order.getOrderItems().remove(orderItem);
        order.setTotalPrice(order.getTotalPrice().subtract(orderItem.getPrice()));

        orderRepository.save(order); // Сохраняем изменения, но не возвращаем объект.
    }


    @Override
    public void deleteOrder(Long orderId) {
        if(!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(orderId);
    }
}
