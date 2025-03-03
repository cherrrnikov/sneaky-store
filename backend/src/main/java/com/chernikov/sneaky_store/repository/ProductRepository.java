package com.chernikov.sneaky_store.repository;

import com.chernikov.sneaky_store.entity.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends CrudRepository<Product, Long> {
    List<Product> findByCategories_Name(String name);

    List<Product> findByManufacturer(String manufacturer);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN p.categories c " +
            "WHERE (:query IS NULL OR :query = '' OR " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.manufacturer) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.color) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.size) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProducts(@Param("query") String query);

}
