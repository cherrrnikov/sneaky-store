package com.chernikov.sneaky_store.mapper;

import com.chernikov.sneaky_store.dto.CategoryDTO;
import com.chernikov.sneaky_store.entity.Category;
import com.chernikov.sneaky_store.entity.Product;
import com.chernikov.sneaky_store.repository.ProductRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class CategoryMapper {

    @Autowired
    private ProductRepository productRepository;

    public static final CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    @Mapping(source = "products", target = "productIDs")
    public abstract CategoryDTO categoryToCategoryDTO(Category category);

    @Mapping(source = "productIDs", target = "products")
    public abstract Category categoryDTOToCategory(CategoryDTO categoryDTO);

    public List<Long> map(List<Product> products) {
        return products.stream()
                .map(Product::getId)
                .collect(Collectors.toList());
    }

    public List<Product> mapToProducts(List<Long> productIDs) {
        return productIDs.stream()
                .map(id -> productRepository.findById(id).orElse(null))
                .filter(product -> product != null)
                .collect(Collectors.toList());
    }
}
