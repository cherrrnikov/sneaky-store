package com.chernikov.sneaky_store.configuration;

import com.chernikov.sneaky_store.mapper.CartItemMapper;
import com.chernikov.sneaky_store.mapper.CartMapper;
import com.chernikov.sneaky_store.mapper.ProductMapper;
import com.chernikov.sneaky_store.mapper.UserMapper;
import com.chernikov.sneaky_store.mapper.order.OrderCreateMapper;
import com.chernikov.sneaky_store.mapper.order.OrderMapper;
import com.chernikov.sneaky_store.mapper.order.OrderSummaryMapper;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemCreateMapper;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {
    @Bean
    public UserMapper userMapper() {
        return UserMapper.INSTANCE;
    }

    @Bean
    public OrderItemCreateMapper orderItemCreateMapper() {
        return OrderItemCreateMapper.INSTANCE;
    }

    @Bean
    public OrderItemMapper orderItemMapper() {
        return OrderItemMapper.INSTANCE;
    }

    @Bean
    public OrderCreateMapper orderCreateMapper() {
        return OrderCreateMapper.INSTANCE;
    }

    @Bean
    public OrderMapper orderMapper() {
        return OrderMapper.INSTANCE;
    }

    @Bean
    public OrderSummaryMapper orderSummaryMapper() {
        return OrderSummaryMapper.INSTANCE;
    }

    @Bean
    public ProductMapper productMapper() {
        return new ProductMapper();
    }

    @Bean
    public CartMapper cartMapper() {
        return CartMapper.INSTANCE;
    }

    @Bean
    public CartItemMapper cartItemMapper() {
        return CartItemMapper.INSTANCE;
    }
}
