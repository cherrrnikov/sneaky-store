package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.entity.*;
import com.chernikov.sneaky_store.mapper.ProductMapper;
import com.chernikov.sneaky_store.repository.CategoryRepository;
import com.chernikov.sneaky_store.repository.OrderRepository;
import com.chernikov.sneaky_store.repository.ProductRepository;
import com.chernikov.sneaky_store.repository.UserRepository;
import com.chernikov.sneaky_store.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductMapper productMapper;

    @Autowired
    public AdminServiceImpl(ProductRepository productRepository, UserRepository userRepository, ProductMapper productMapper,
                            OrderRepository orderRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.productMapper = new ProductMapper();
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductDTO addProduct(ProductDTO productDTO, String email) {
        Product product = productMapper.productDTOToProduct(productDTO, null);
        // Set additional fields like user who added the product, etc.
        Product savedProduct = productRepository.save(product);
        return productMapper.productToProductDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO, String email) {
        Optional<Product> existingProductOpt = productRepository.findById(productId);
        if (existingProductOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product existingProduct = existingProductOpt.get();
        existingProduct.setName(productDTO.getName());
        existingProduct.setManufacturer(productDTO.getManufacturer());  // Update manufacturer as brand
        existingProduct.setColor(productDTO.getColor());
        existingProduct.setSize(productDTO.getSize());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setPhotoURL(productDTO.getPhotoURL());

        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.productToProductDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Long productId, String email) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(productId);
    }

    @Override
    public void addCategory(String categoryName, String email) {
//        // Проверка, существует ли уже такая категория
//        Optional<Category> existingCategoryOpt = categoryRepository.findByName(categoryName);
//        if (existingCategoryOpt.isPresent()) {
//            throw new RuntimeException("Category already exists");
//        }
//
//        // Создание и сохранение новой категории
//        Category category = new Category();
//        category.setName(categoryName);
//        categoryRepository.save(category);
    }


    @Override
    public void deleteCategory(Long categoryId, String email) {
//        // Проверка, существует ли категория с таким ID
//        Category category = categoryRepository.findById(categoryId)
//                .orElseThrow(() -> new RuntimeException("Category not found"));
//
//        // Проверка, есть ли товары с этой категорией
//        List<Product> productsWithCategory = productRepository.findByCategory(category);
//        if (!productsWithCategory.isEmpty()) {
//            throw new RuntimeException("Cannot delete category, products are still assigned to it");
//        }
//
//        // Удаление категории
//        categoryRepository.delete(category);
    }


    @Override
    public void addBrand(String brandName, String email) {
        // Since brand is part of the manufacturer field, we can add products with this manufacturer
        // This could involve creating products with a particular manufacturer name (brand)
        // Optionally, you could also add logic for checking if the brand already exists.
        Product sampleProduct = new Product();
        sampleProduct.setManufacturer(brandName);
        productRepository.save(sampleProduct);  // Create a product with the given manufacturer name (brand)
    }

    @Override
    public void deleteBrand(String brandName, String email) {
        // Проверяем, есть ли товары с таким брендом
        if (!productRepository.existsByManufacturer(brandName)) {
            throw new RuntimeException("Brand not found");
        }

        // Удаляем все товары с этим брендом
        productRepository.deleteAllByManufacturer(brandName);
    }

    @Override
    public void deleteUser(Long userId, String email) {
        // Fetch the user to be deleted
        User userToDelete = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Additional logic for authorization could go here, for instance, checking the email of the user making the request
        // For now, we'll assume the user is authorized to delete any user.

        // Delete the user
        userRepository.delete(userToDelete);
    }

    @Override
    public void updateOrderStatus(Long orderId, OrderStatus status, String email) {
        // Fetch the order by ID
        Order orderToUpdate = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        // Update the status of the order
        orderToUpdate.setStatus(status);

        // Save the updated order
        orderRepository.save(orderToUpdate);
    }
}
