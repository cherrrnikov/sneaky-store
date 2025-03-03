package com.chernikov.sneaky_store.mapper.order;

import com.chernikov.sneaky_store.dto.order.OrderSummaryDTO;
import com.chernikov.sneaky_store.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderSummaryMapper {
    OrderSummaryMapper INSTANCE = Mappers.getMapper(OrderSummaryMapper.class);

    OrderSummaryDTO orderToOrderSummaryDTO(Order order);
}
