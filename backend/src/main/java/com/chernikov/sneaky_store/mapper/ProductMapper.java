package com.chernikov.sneaky_store.mapper;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.entity.Category;
import com.chernikov.sneaky_store.entity.Product;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.List;

public class ProductMapper {
    public ProductDTO productToProductDTO(Product product) {
        if (product == null) {
            return null;
        }

        List<String> categoryNames = product.getCategories().stream()
                .map(Category::getName)
                .toList();

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getManufacturer(),
                product.getColor(),
                product.getSize(),
                product.getPrice(),
                product.getPhotoURL(),
                categoryNames
        );
    }

    public Product productDTOToProduct(ProductDTO productDTO, List<Category> categories) {
        if (productDTO == null) {
            return null;
        }

        Product product = new Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setManufacturer(productDTO.getManufacturer());
        product.setColor(productDTO.getColor());
        product.setSize(productDTO.getSize());
        product.setPrice(productDTO.getPrice());
        product.setPhotoURL(productDTO.getPhotoURL());
        product.setCategories(categories);

        return product;
    }
}
