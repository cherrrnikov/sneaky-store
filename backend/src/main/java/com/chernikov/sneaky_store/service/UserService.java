package com.chernikov.sneaky_store.service;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.entity.Role;

import java.util.List;

public interface UserService {
    UserDTO getUserById(Long id);

    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);

    List<UserDTO> getAllUsers();

    void addProductToLiked(Long userId, Long productId);

    void removeProductFromLiked(Long userId, Long productId);

    List<ProductDTO> getLikedProducts(Long userId);

    // FOR ADMINS

    UserDTO assignRole(Long userId, Role role, String adminEmail);

    UserDTO removeRole(Long userId, Role role, String adminEmail);

    UserDTO clearRoles(Long userId, String adminEmail);
}
