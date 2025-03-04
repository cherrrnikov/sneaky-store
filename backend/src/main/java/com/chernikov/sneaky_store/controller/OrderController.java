package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.order.OrderCreateDTO;
import com.chernikov.sneaky_store.dto.order.OrderDTO;
import com.chernikov.sneaky_store.dto.order.OrderSummaryDTO;
import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;
import com.chernikov.sneaky_store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderCreateDTO orderCreateDTO) {
        OrderDTO orderDTO = orderService.createOrder(orderCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderDTO);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable("orderId") Long orderId) {
        OrderDTO orderDTO = orderService.getOrderById(orderId);
        return orderDTO != null ? ResponseEntity.ok(orderDTO) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<OrderSummaryDTO>> getAllOrders() {
        List<OrderSummaryDTO> orderSummaries = orderService.getAllOrders();
        return ResponseEntity.ok(orderSummaries);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable("userId") Long userId) {
        List<OrderDTO> orderDTOS = orderService.getOrdersByUserId(userId);
        return orderDTOS != null ? ResponseEntity.ok(orderDTOS) : ResponseEntity.notFound().build();
    }

    @GetMapping("/details")
    public ResponseEntity<List<OrderDTO>> getAllOrdersWithDetails() {
        List<OrderDTO> orderDTOs = orderService.getAllOrdersWithDetails();
        return ResponseEntity.ok(orderDTOs);
    }

    @PutMapping("/{orderId}/add")
    public ResponseEntity<Void> addToOrder(@PathVariable("orderId") Long orderId, @RequestBody OrderItemDTO orderItemDTO) {
        try {
            orderService.addToOrder(orderId, orderItemDTO);
            return ResponseEntity.ok().build(); // Теперь мы возвращаем статус 200 без объекта
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{orderId}/remove")
    public ResponseEntity<Void> deleteFromOrder(@PathVariable("orderId") Long orderId, @RequestBody OrderItemDTO orderItemDTO) {
        try {
            orderService.deleteFromOrder(orderId, orderItemDTO);
            return ResponseEntity.ok().build(); // Теперь мы возвращаем статус 200 без объекта
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("orderId") Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
