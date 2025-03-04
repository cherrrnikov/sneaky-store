package com.chernikov.sneaky_store.repository;

import com.chernikov.sneaky_store.entity.Order;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OrderRepository extends CrudRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}
