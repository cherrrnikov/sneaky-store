package com.chernikov.sneaky_store.mapper.order;

import com.chernikov.sneaky_store.dto.order.OrderDTO;
import com.chernikov.sneaky_store.entity.Order;
import com.chernikov.sneaky_store.mapper.order_item.OrderItemMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(uses = {OrderItemMapper.class})
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(source = "user.id", target = "userID")
    @Mapping(source = "orderItems", target = "orderItems")
    @Mapping(source = "status", target = "status")
    OrderDTO orderToOrderDTO(Order order);

    @Mapping(source = "userID", target = "user.id")
    @Mapping(source = "orderItems", target = "orderItems")
    @Mapping(source = "status", target = "status")
    Order orderDTOToOrder(OrderDTO orderDTO);
}
