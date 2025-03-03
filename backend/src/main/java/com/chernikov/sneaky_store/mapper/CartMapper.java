package com.chernikov.sneaky_store.mapper;

import com.chernikov.sneaky_store.dto.CartDTO;
import com.chernikov.sneaky_store.dto.cart_item.CartItemDTO;
import com.chernikov.sneaky_store.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(uses = CartItemMapper.class)
public interface CartMapper {
    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

    default CartDTO cartToCartDTO(Cart cart) {
        Set<CartItemDTO> cartItemDTOS = (cart.getCartItems() != null)
                ? cart.getCartItems().stream()
                .map(CartItemMapper.INSTANCE::cartItemToCartItemDTO)
                .collect(Collectors.toSet())
                : Collections.emptySet();  // Пустое множество, если cartItems null

        return new CartDTO(cart.getId(), cart.getUser().getId(), cartItemDTOS);
    }

}
