package com.chernikov.sneaky_store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String manufacturer;
    private String color;
    private String size;
    private BigDecimal price;
    private String photoURL;
    private List<String> categories;
}
