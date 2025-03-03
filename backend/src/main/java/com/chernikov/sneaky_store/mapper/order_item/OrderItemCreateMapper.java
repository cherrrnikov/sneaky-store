package com.chernikov.sneaky_store.mapper.order_item;

import com.chernikov.sneaky_store.dto.order_item.OrderItemCreateDTO;
import com.chernikov.sneaky_store.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderItemCreateMapper {
    OrderItemCreateMapper INSTANCE = Mappers.getMapper(OrderItemCreateMapper.class);

    @Mapping(source = "productID", target = "product.id")
    OrderItem orderItemCreateDTOToOrderItem(OrderItemCreateDTO orderItemCreateDTO);

    @Mapping(source = "product.id", target = "productID")
    OrderItemCreateDTO orderItemToOrderItemCreateDTO(OrderItem orderItem);
}
