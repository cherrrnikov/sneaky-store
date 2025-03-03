package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.order_item.OrderItemCreateDTO;
import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;
import com.chernikov.sneaky_store.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders/{orderId}/items")
public class OrderItemController {
    private final OrderItemService orderItemService;

    @Autowired
    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping
    public ResponseEntity<OrderItemDTO> createOrderItem(@PathVariable("orderId") Long orderId, @RequestBody OrderItemCreateDTO orderItemCreateDTO) {
        OrderItemDTO orderItemDTO = orderItemService.createOrderItem(orderItemCreateDTO, orderId);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderItemDTO);
    }

    @GetMapping
    public ResponseEntity<List<OrderItemDTO>> getOrderItemsByOrderId(@PathVariable("orderId") Long orderId) {
        List<OrderItemDTO> orderItemDTOS = orderItemService.getOrderItemsByOrderId(orderId);
        return orderItemDTOS.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(orderItemDTOS);
    }

    @DeleteMapping("/{orderItemId}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable("orderId") Long orderId, @PathVariable("orderItemId") Long orderItemId) {
        try {
            orderItemService.deleteOrderItem(orderItemId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
