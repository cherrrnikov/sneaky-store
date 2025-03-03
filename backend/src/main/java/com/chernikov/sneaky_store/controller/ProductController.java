package com.chernikov.sneaky_store.controller;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable("id") Long id) {
        ProductDTO productDTO = productService.getProductById(id);
        return productDTO != null ? ResponseEntity.ok(productDTO) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> productDTOList = productService.getAllProducts();
        return productDTOList.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(productDTOList);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getAllProductsByCategory(@PathVariable("category") String category) {
        List<ProductDTO> productDTOList = productService.getProductsByCategory(category);
        return productDTOList.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(productDTOList);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO productDTOCreated = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(productDTOCreated);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable("id") Long id, @RequestBody ProductDTO productDTO) {
        try {
            ProductDTO updatedProductDTO = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(updatedProductDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        List<String> brands = productService.getAllBrands();
        return brands.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(brands);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<ProductDTO>> getAllProductsByBrand(@PathVariable("brand") String brand) {
        List<ProductDTO> productDTOList = productService.getProductsByBrand(brand);
        return productDTOList.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(productDTOList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String query) {
        List<ProductDTO> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }

}
