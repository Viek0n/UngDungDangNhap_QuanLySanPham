package com.flogin.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.repository.UserRepository;
import com.flogin.security.JwtTokenUtil;
import com.flogin.entity.User;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Validation trước khi authenticate
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Vui lòng nhập tên đăng nhập");
        }
        if (password == null || password.isBlank()) {
            throw new RuntimeException("Vui lòng nhập mật khẩu");
        }
        if (username.length() < 2) {
            throw new RuntimeException("Username quá ngắn");
        }
        if (username.length() > 50) {
            throw new RuntimeException("Username quá dài");
        }
        if (password.length() < 6) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 6 ký tự");
        }
        if (password.length() > 100) {
            throw new RuntimeException("Mật khẩu quá dài");
        }
        if (username.contains(" ")) {
            throw new RuntimeException("Tên đăng nhập không được chứa khoảng trắng");
        }
        if (!username.matches("^[a-zA-Z0-9]+$")) {
            throw new RuntimeException("Tên đăng nhập không được chứa ký tự đặc biệt");
        }

        // authenticate với Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(userDetails);

        return new LoginResponse(token, "Login thành công");
    }
}