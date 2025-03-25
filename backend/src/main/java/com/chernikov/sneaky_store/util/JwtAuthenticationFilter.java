package com.chernikov.sneaky_store.util;

import com.chernikov.sneaky_store.service.AuthService;
import jakarta.servlet.http.Cookie;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import io.jsonwebtoken.Claims;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;


    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String accessToken = extractToken(request);

        if (accessToken != null && jwtUtil.isTokenValid(accessToken)) {
            String email = jwtUtil.extractEmail(accessToken);
            List<SimpleGrantedAuthority> authorities = getAuthoritiesFromToken(accessToken);

            // Создаем аутентификацию пользователя и сохраняем ее в SecurityContext
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        chain.doFilter(request, response);
    }

    public String extractToken(HttpServletRequest request) {
        String cookieToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("accessToken")) {
                    cookieToken = cookie.getValue();
                    break;
                }
            }
        }

        return cookieToken;
    }

    private List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = jwtUtil.getClaims(token);
        List<String> roles = claims.get("roles", List.class); // Извлекаем список ролей
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role)) // Преобразуем роли в SimpleGrantedAuthority
                .collect(Collectors.toList());
    }
}
