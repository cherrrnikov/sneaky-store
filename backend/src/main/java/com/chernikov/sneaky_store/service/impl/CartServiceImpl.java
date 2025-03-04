package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.CartDTO;
import com.chernikov.sneaky_store.dto.cart_item.CartItemCreateDTO;
import com.chernikov.sneaky_store.dto.cart_item.CartItemDTO;
import com.chernikov.sneaky_store.entity.Cart;
import com.chernikov.sneaky_store.entity.CartItem;
import com.chernikov.sneaky_store.entity.Product;
import com.chernikov.sneaky_store.mapper.CartItemMapper;
import com.chernikov.sneaky_store.mapper.CartMapper;
import com.chernikov.sneaky_store.repository.CartItemRepository;
import com.chernikov.sneaky_store.repository.CartRepository;
import com.chernikov.sneaky_store.repository.ProductRepository;
import com.chernikov.sneaky_store.repository.UserRepository;
import com.chernikov.sneaky_store.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
                           ProductRepository productRepository, CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.cartMapper = cartMapper;
    }

    @Override
    public CartDTO getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for this user"));
        return cartMapper.cartToCartDTO(cart);
    }

    @Override
    public void addToCart(Long userId, CartItemCreateDTO cartItemCreateDTO) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for this user"));
        Product product = productRepository.findById(cartItemCreateDTO.getProductID())
                .orElseThrow(() -> new RuntimeException("Product not found for this user"));
        Optional<CartItem> existingCartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            cartItemRepository.save(cartItem);
        } else {
            CartItem newCartItem = new CartItem(null, cart, product, 1);
            cartItemRepository.save(newCartItem);
        }
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for this user"));

        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
    }

    @Override
    public void removeFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for this user"));
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        if (cartItem.getQuantity() == 1) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            cartItemRepository.save(cartItem);
        }
    }

    @Override
    public void removeFromCartFull(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for this user"));
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }
        cartItemRepository.delete(cartItem);
    }
}
