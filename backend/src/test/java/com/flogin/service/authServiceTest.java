package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.security.JwtTokenUtil;
import com.flogin.service.AuthServiceImpl;
import com.flogin.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class authServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("TC1: Login thành công")
    void testLoginSuccess() {

        LoginRequest req = new LoginRequest("user123", "password123");

        when(authenticationManager.authenticate(
                any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);

        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtTokenUtil.generateToken(userDetails)).thenReturn("token123");

        LoginResponse response = authService.login(req);

        assertEquals("token123", response.getToken());
        assertEquals("Login thành công", response.getMessage());

        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        verify(jwtTokenUtil, times(1)).generateToken(userDetails);
    }

    @Test
    @DisplayName("TC2: Username chứa ký tự đặc biệt")
    void testLoginWrongUsername() {

        LoginRequest req = new LoginRequest("wrong user!", "Pass123");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Tên đăng nhập không được chứa ký tự đặc biệt"));
    }

    @Test
    @DisplayName("TC3: Password sai định dạng")
    void testLoginWrongPassword() {

        LoginRequest req = new LoginRequest("user123", "123");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Mật khẩu phải có ít nhất 6 ký tự"));
    }

    @Test
    @DisplayName("TC4: Username và password trống")
    void testLogin_EmptyFields() {

        LoginRequest req = new LoginRequest("", "");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertEquals("Vui lòng nhập tên đăng nhập", ex.getMessage());
    }
}
