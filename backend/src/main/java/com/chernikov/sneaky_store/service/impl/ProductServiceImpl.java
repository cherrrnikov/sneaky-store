package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.entity.Category;
import com.chernikov.sneaky_store.entity.Product;
import com.chernikov.sneaky_store.mapper.ProductMapper;
import com.chernikov.sneaky_store.repository.CategoryRepository;
import com.chernikov.sneaky_store.repository.OrderItemRepository;
import com.chernikov.sneaky_store.repository.ProductRepository;
import com.chernikov.sneaky_store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.productMapper = new ProductMapper();
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(productMapper::productToProductDTO).orElse(null);
    }

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        List<Category> categories = mapNamesToCategories(productDTO.getCategories());

        Product product = productMapper.productDTOToProduct(productDTO, categories);
        Product savedProduct = productRepository.save(product);
        return productMapper.productToProductDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        List<Category> categories = mapNamesToCategories(productDTO.getCategories());

        Product product = productMapper.productDTOToProduct(productDTO, categories);
        product.setId(id);

        Product updatedProduct = productRepository.save(product);
        return productMapper.productToProductDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (!productOptional.isPresent()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOptional.get();

        productRepository.delete(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = (List<Product>) productRepository.findAll();
        return products.stream()
                .map(productMapper::productToProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategories_Name(category);
        return products.stream()
                .map(productMapper::productToProductDTO)
                .collect(Collectors.toList());
    }

    private List<Category> mapNamesToCategories(List<String> names) {
        if (names == null || names.isEmpty()) {
            return null;
        }
        return names.stream()
                .map(name -> categoryRepository.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Category not found: " + name)))
                .collect(Collectors.toList());
    }

    public List<String> getAllBrands() {
        List<Product> products = (List<Product>) productRepository.findAll();
        return products.stream()
                .map(Product::getManufacturer)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByBrand(String manufacturer) {
        List<Product> products = productRepository.findByManufacturer(manufacturer);
        return products.stream()
                .map(productMapper::productToProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String[] words = query.trim().toLowerCase().split("\\s+");

        Set<Product> results = new HashSet<>(productRepository.searchProducts(query));

        for (String word : words) {
            results.addAll(productRepository.searchProducts(word));
        }

        List<Product> filteredResults = results.stream()
                .filter(product -> containsAllWords(product, words))
                .toList();

        return filteredResults.stream()
                .map(productMapper::productToProductDTO)
                .collect(Collectors.toList());
    }

    private boolean containsAllWords(Product product, String[] words) {
        String searchableText = (product.getName() + " " + product.getManufacturer() + " " +
                product.getColor() + " " + product.getSize() + " " +
                product.getCategories().stream()
                        .map(Category::getName)
                        .collect(Collectors.joining(" ")))
                .toLowerCase();

        return Arrays.stream(words).allMatch(searchableText::contains);
    }



}
