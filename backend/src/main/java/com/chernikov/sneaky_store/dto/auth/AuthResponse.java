package com.chernikov.sneaky_store.dto.auth;

import com.chernikov.sneaky_store.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;
}
