package com.chernikov.sneaky_store.repository;

import com.chernikov.sneaky_store.entity.OrderItem;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OrderItemRepository extends CrudRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    void deleteByProductId(Long id);
}
