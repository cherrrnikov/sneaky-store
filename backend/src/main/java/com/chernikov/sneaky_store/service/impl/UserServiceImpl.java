package com.chernikov.sneaky_store.service.impl;

import com.chernikov.sneaky_store.dto.ProductDTO;
import com.chernikov.sneaky_store.dto.UserDTO;
import com.chernikov.sneaky_store.entity.Cart;
import com.chernikov.sneaky_store.entity.Product;
import com.chernikov.sneaky_store.entity.Role;
import com.chernikov.sneaky_store.entity.User;
import com.chernikov.sneaky_store.mapper.ProductMapper;
import com.chernikov.sneaky_store.mapper.UserMapper;
import com.chernikov.sneaky_store.repository.CartRepository;
import com.chernikov.sneaky_store.repository.ProductRepository;
import com.chernikov.sneaky_store.repository.UserRepository;
import com.chernikov.sneaky_store.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final ProductMapper productMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, ProductRepository productRepository, ProductMapper productMapper, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.cartRepository = cartRepository;
    }


    @Override
    public UserDTO getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(userMapper::userToUserDTO).orElse(null);
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = userMapper.userDTOToUser(userDTO);
        User savedUser = userRepository.save(user);
        return userMapper.userToUserDTO(savedUser);
    }


    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        User user = userMapper.userDTOToUser(userDTO);
        user.setId(id);
        User updatedUser = userRepository.save(user);
        return userMapper.userToUserDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getCart() != null) {
            cartRepository.delete(user.getCart());  // Я не разобрался, почему не работает каскадное удаление, поэтому костыль
        }

        userRepository.deleteById(id);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        return users.stream()
                .map(userMapper::userToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void addProductToLiked(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        user.getLikedProducts().add(product);
        userRepository.save(user);
    }

    @Override
    public void removeProductFromLiked(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        user.getLikedProducts().remove(product);
        userRepository.save(user);
    }

    @Override
    public List<ProductDTO> getLikedProducts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getLikedProducts().stream()
                .map(productMapper::productToProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO assignRole(Long userId, Role role, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!admin.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Only admins can assign roles.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getRoles().add(role);
        userRepository.save(user);

        return userMapper.userToUserDTO(user);
    }

    @Override
    public UserDTO removeRole(Long userId, Role role, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!admin.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Only admins can remove roles.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getRoles().remove(role);
        userRepository.save(user);

        return userMapper.userToUserDTO(user);
    }

    @Override
    public UserDTO clearRoles(Long userId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!admin.getRoles().contains(Role.ADMIN)) {
            throw new RuntimeException("Only admins can clear roles.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getRoles().clear();
        userRepository.save(user);

        return userMapper.userToUserDTO(user);
    }
}
