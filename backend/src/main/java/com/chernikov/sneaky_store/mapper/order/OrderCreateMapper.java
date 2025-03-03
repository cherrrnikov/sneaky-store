package com.chernikov.sneaky_store.mapper.order;

import com.chernikov.sneaky_store.dto.order.OrderCreateDTO;
import com.chernikov.sneaky_store.entity.Order;
import com.chernikov.sneaky_store.mapper.UserMapper;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemCreateMapper;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(uses = {OrderItemCreateMapper.class, UserMapper.class, OrderItemMapper.class})
public interface OrderCreateMapper {
    OrderCreateMapper INSTANCE = Mappers.getMapper(OrderCreateMapper.class);

    @Mapping(source = "userID", target = "user.id")
    @Mapping(source = "orderItems", target = "orderItems")
    Order orderCreateDTOToOrder(OrderCreateDTO orderCreateDTO);

    @Mapping(source = "user.id", target = "userID")
    @Mapping(source = "orderItems", target = "orderItems")
    OrderCreateDTO orderToOrderCreateDTO(Order order);

}
