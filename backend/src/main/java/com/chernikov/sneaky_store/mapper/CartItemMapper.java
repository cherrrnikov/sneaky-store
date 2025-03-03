package com.chernikov.sneaky_store.mapper;

import com.chernikov.sneaky_store.dto.cart_item.CartItemDTO;
import com.chernikov.sneaky_store.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CartItemMapper {
    CartItemMapper INSTANCE = Mappers.getMapper(CartItemMapper.class);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "product.id", target = "productID")
    @Mapping(source = "product.name", target = "productName")
    CartItemDTO cartItemToCartItemDTO(CartItem cartItem);

    @Mapping(source = "productID", target = "product.id")
    CartItem cartItemDTOToCartItem(CartItemDTO cartItemDTO);


}
