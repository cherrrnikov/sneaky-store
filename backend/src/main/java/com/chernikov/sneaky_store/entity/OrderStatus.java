package com.chernikov.sneaky_store.entity;

public enum OrderStatus {
    PENDING,       // Заказ создан, ожидает подтверждения
    CONFIRMED,     // Заказ подтверждён
    SHIPPED,       // Заказ отправлен
    DELIVERED,     // Заказ доставлен клиенту
    CANCELLED;     // Заказ отменён
}
