package com.flogin.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.flogin.entity.User;
import com.flogin.entity.Product;
import com.flogin.repository.UserRepository;
import com.flogin.repository.ProductRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
            }
            if (productRepository.count() == 0) {
                List<Product> products = new ArrayList<>();
                products.add(new Product("Pizza", "Delicious pizza", 120.0, 10, "Món chính"));
                products.add(new Product("Bánh kem", "Bánh kem ngon", 80.0, 5, "Tráng miệng"));
                products.add(new Product("Gà rán", "Gà rán giòn cay", 65.0, 18, "Món chính"));
                products.add(new Product("Mỳ Ý", "Mỳ Ý sốt bò bằm", 70.0, 12, "Món chính"));
                products.add(new Product("Salad", "Salad rau củ", 50.0, 20, "Tráng miệng"));
                products.add(new Product("Kem socola", "Kem socola lạnh", 40.0, 15, "Tráng miệng"));
                products.add(new Product("Bánh mì", "Bánh mì kẹp thịt", 30.0, 25, "Món chính"));
                products.add(new Product("Nước ngọt", "Coca Cola 500ml", 20.0, 30, "Thức uống"));
                products.add(new Product("Trà sữa", "Trà sữa trân châu", 35.0, 22, "Thức uống"));
                products.add(new Product("Cà phê", "Cà phê đen nóng", 25.0, 18, "Thức uống"));
                products.add(new Product("Pizza nhỏ", "Pizza mini", 60.0, 5, "Món chính"));
                products.add(new Product("Bánh quy", "Bánh quy bơ", 15.0, 40, "Tráng miệng"));
                products.add(new Product("Gà nướng", "Gà nướng mật ong", 80.0, 10, "Món chính"));
                products.add(new Product("Kem vani", "Kem vani mềm", 35.0, 10, "Tráng miệng"));
                products.add(new Product("Nước ép cam", "Nước cam tươi", 30.0, 20, "Thức uống"));
                productRepository.saveAll(products);
            }
        };
    }
}