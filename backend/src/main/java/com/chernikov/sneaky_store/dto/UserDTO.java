package com.chernikov.sneaky_store.dto;

import com.chernikov.sneaky_store.entity.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String username;

    @JsonIgnore
    private String password;

    private Set<Role> roles;
    private Long cartId;
}
