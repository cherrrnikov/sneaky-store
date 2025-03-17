package com.chernikov.sneaky_store.service;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.entity.OrderStatus;

public interface AdminService {
    ProductDTO addProduct(ProductDTO productDTO, String email);
    ProductDTO updateProduct(Long productId, ProductDTO productDTO, String email);
    void deleteProduct(Long productId, String email);
    void addCategory(String categoryName, String email);
    void deleteCategory(Long categoryId, String email);
    void addBrand(String brandName, String email);  // Handle brand creation (via manufacturer)
    void deleteBrand(String brandName, String email);  // Handle brand deletion (via manufacturer)
    void deleteUser(Long userId, String email);
    void updateOrderStatus(Long orderId, OrderStatus status, String email);
}