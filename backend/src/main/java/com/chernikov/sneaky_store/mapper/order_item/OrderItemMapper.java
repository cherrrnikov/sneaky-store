package com.chernikov.sneaky_store.mapper.order_item;

import com.chernikov.sneaky_store.dto.order_item.OrderItemDTO;
import com.chernikov.sneaky_store.entity.OrderItem;
import com.chernikov.sneaky_store.mapper.ProductMapper;
import com.chernikov.sneaky_store.mapper.order.OrderMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(uses = {ProductMapper.class, OrderMapper.class})
public interface OrderItemMapper {
    OrderItemMapper INSTANCE = Mappers.getMapper(OrderItemMapper.class);

    @Mapping(source = "order.id", target = "orderID")
    @Mapping(source = "product.id", target = "productID")
    @Mapping(source = "product.name", target = "productName")
    OrderItemDTO orderItemToOrderItemDTO(OrderItem orderItem);

    @Mapping(source = "orderID", target = "order.id")
    @Mapping(source = "productID", target = "product.id")
    OrderItem orderItemDTOToOrderItem(OrderItemDTO orderItemDTO);
}
