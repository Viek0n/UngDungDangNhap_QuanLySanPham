package com.flogin.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.repository.UserRepository;
import com.flogin.security.JwtTokenUtil;
//mvn test -Dtest=authServiceTest
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
    @DisplayName("TC2: Login với username không tồn tại")
    void testLoginWrongUsername() {
        // Username hợp lệ (không chứa ký tự đặc biệt, không rỗng)
        LoginRequest req = new LoginRequest("wronguser", "Pass123");

        // Mock authenticationManager để ném lỗi khi username không tồn tại
        when(authenticationManager.authenticate(
            any(UsernamePasswordAuthenticationToken.class)))
        .thenThrow(new RuntimeException("Username không tồn tại"));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> authService.login(req));

        // Kiểm tra message trả về từ backend
        assertTrue(ex.getMessage().contains("Username không tồn tại"));
    }

    @Test
    @DisplayName("TC3: Login với password sai")
    void testLoginWrongPassword() {
        // Username hợp lệ, password sai
        LoginRequest req = new LoginRequest("user123", "wrongPassword");

        // Mock authenticationManager để ném lỗi khi password không đúng
        when(authenticationManager.authenticate(
            any(UsernamePasswordAuthenticationToken.class)))
        .thenThrow(new RuntimeException("Mật khẩu không đúng"));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> authService.login(req));

        // Kiểm tra message
        assertTrue(ex.getMessage().contains("Mật khẩu không đúng"));
    }

    @Test
    @DisplayName("TC4: Username chứa ký tự đặc biệt")
    void testLoginUsernameSpecialChar() {
        LoginRequest req = new LoginRequest("wronguser!", "Pass123");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Tên đăng nhập không được chứa ký tự đặc biệt"));
    }

    @Test
    @DisplayName("TC5: Password ngắn")
    void testLoginPasswordShort() {
        LoginRequest req = new LoginRequest("user123", "123");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Mật khẩu phải dài 6-100 kí tự"));
    }

    @Test
    @DisplayName("TC6: Username và password trống")
    void testLoginUsernamePassword_EmptyFields() {

        LoginRequest req = new LoginRequest("", "");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertEquals("Vui lòng nhập tên đăng nhập", ex.getMessage());
    }

    @Test
    @DisplayName("TC7: Mật khẩu trống")
    void testLoginPassword_EmptyFields() {
        LoginRequest req = new LoginRequest("admin", "");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertEquals("Vui lòng nhập mật khẩu", ex.getMessage());
    }

    @Test
    @DisplayName("TC8: Username chứa khoảng trắng")
    void testLoginUsername_Space() {
        LoginRequest req = new LoginRequest("wrong user", "admin123");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Tên đăng nhập không được chứa khoảng trắng"));
    }

    @Test
    @DisplayName("TC9: Username quá ngắn")
    void testLoginUsernameShort() {

        LoginRequest req = new LoginRequest("1", "admin123");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Username phải dài 2-50 kí tự"));
    }

    @Test
    @DisplayName("TC10: Username quá dài")
    void testLoginUsernameLong() {

        LoginRequest req = new LoginRequest(
                "1123213213213213213213213123213213232321321323213232132122222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222",
                "admin123");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Username phải dài 2-50 kí tự"));
    }

    @Test
    @DisplayName("TC11: Password dài")
    void testLoginPasswordLong() {
        LoginRequest req = new LoginRequest("user123",
                "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertTrue(ex.getMessage().contains("Mật khẩu phải dài 6-100 kí tự"));
    }

}
