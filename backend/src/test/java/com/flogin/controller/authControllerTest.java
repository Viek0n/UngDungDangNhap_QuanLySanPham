package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class authControllerTest {

    @Mock
    private AuthService authService; 

    @InjectMocks
    private AuthController authController; 

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); 
    }

    // 1. Happy Path
    @Test
    void testlogin_ThanhCong() {
        LoginRequest request = new LoginRequest("user123", "password123");
        LoginResponse response = new LoginResponse("token123", "Đăng nhập thành công");

       
        when(authService.login(request)).thenReturn(response);

        var result = authController.login(request);

        assertEquals("token123", result.getBody().getToken());
        assertEquals("Đăng nhập thành công", result.getBody().getMessage());
        verify(authService, times(1)).login(request);
    }

    // 2. Negative - Username rỗng
    @Test
    void testlogin_UsernameRong() {
        LoginRequest request = new LoginRequest("", "password123");

       
        when(authService.login(request))
                .thenThrow(new RuntimeException("Vui lòng nhập tên đăng nhập"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.login(request));

        assertTrue(exception.getMessage().contains("Vui lòng nhập tên đăng nhập"));
    }

    // 3. Negative - Password rỗng
    @Test
    void testlogin_PasswordRong() {
        LoginRequest request = new LoginRequest("user123", "");

        when(authService.login(request))
                .thenThrow(new RuntimeException("Vui lòng nhập mật khẩu"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.login(request));

        assertTrue(exception.getMessage().contains("Vui lòng nhập mật khẩu"));
    }

    // 4. Negative - Username chứa ký tự đặc biệt
    @Test
    void testlogin_UsernameKyTuDacBiet() {
        LoginRequest request = new LoginRequest("user@123", "password123");

        when(authService.login(request))
                .thenThrow(new RuntimeException("Tên đăng nhập không được chứa ký tự đặc biệt"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.login(request));

        assertTrue(exception.getMessage().contains("ký tự đặc biệt"));
    }

    // 5. Negative - Password quá ngắn (<6 ký tự)
    @Test
    void testlogin_PasswordQuaNgan() {
        LoginRequest request = new LoginRequest("user123", "123");

        when(authService.login(request))
                .thenThrow(new RuntimeException("Mật khẩu phải có ít nhất 6 ký tự"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.login(request));

        assertTrue(exception.getMessage().contains("ít nhất 6 ký tự"));
    }

    // 6. Boundary - Username độ dài tối thiểu (min = 2 ký tự)
    @Test
    void testlogin_UsernameDoDaiToiThieu() {
        LoginRequest request = new LoginRequest("us", "password123");
        LoginResponse response = new LoginResponse("token_min", "Đăng nhập thành công");

        when(authService.login(request)).thenReturn(response);

        var result = authController.login(request);
        assertEquals("token_min", result.getBody().getToken());
    }

    // 7. Boundary - Username vượt quá độ dài tối đa (max = 50 ký tự)
    @Test
    void testlogin_UsernameVuotDaiToiDa() {
        String longUsername = "a".repeat(51);
        LoginRequest request = new LoginRequest(longUsername, "password123");

        when(authService.login(request))
                .thenThrow(new RuntimeException("Username quá dài"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.login(request));

        assertTrue(exception.getMessage().contains("quá dài"));
    }

    // 8. Boundary - Password vượt quá độ dài tối đa (max = 100 ký tự)
    @Test
    void testlogin_PasswordVuotDaiToiDa() {
        String longPassword = "p".repeat(101);
        LoginRequest request = new LoginRequest("user123", longPassword);

        when(authService.login(request))
                .thenThrow(new RuntimeException("Mật khẩu quá dài"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.login(request));

        assertTrue(exception.getMessage().contains("quá dài"));
    }

    // 9. Edge case - Username có khoảng trắng (không trim)
    @Test
    void testlogin_UsernameCoKhoangTrang() {
        LoginRequest request = new LoginRequest(" user123 ", "password123");

        when(authService.login(request))
                .thenThrow(new RuntimeException("Tên đăng nhập không được chứa khoảng trắng"));

        Exception exception = assertThrows(RuntimeException.class,
                () -> authController.login(request));

        assertTrue(exception.getMessage().contains("không được chứa khoảng trắng"));
    }

    // 10. Edge case - Password có ký tự đặc biệt (cho phép)
    @Test
    void testlogin_PasswordKyTuDacBiet() {
        LoginRequest request = new LoginRequest("user123", "pass@123!");
        LoginResponse response = new LoginResponse("token_special", "Đăng nhập thành công");

        when(authService.login(request)).thenReturn(response);

        var result = authController.login(request);
        assertEquals("token_special", result.getBody().getToken());
    }
}
