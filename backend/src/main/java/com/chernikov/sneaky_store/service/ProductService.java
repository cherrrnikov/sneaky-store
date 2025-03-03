package com.chernikov.sneaky_store.service;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.entity.Product;

import java.util.List;

public interface ProductService {
    ProductDTO getProductById(Long id);

    ProductDTO createProduct(ProductDTO productDTO);

    ProductDTO updateProduct(Long id, ProductDTO productDTO);

    void deleteProduct(Long id);

    List<ProductDTO> getAllProducts();

    List<ProductDTO> getProductsByCategory(String category);

    List<String> getAllBrands();

    List<ProductDTO> getProductsByBrand(String manufacturer);

    List<ProductDTO> searchProducts(String query);
}
