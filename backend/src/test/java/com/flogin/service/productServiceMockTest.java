package com.flogin.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
//mvn test -Dtest=productServiceMockTest
public class productServiceMockTest {

    @Mock
    private ProductRepository productRepository; // a) Mock ProductRepository (1 điểm)

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- Test getAllProducts ---
    @Test
    void testGetAllProducts() {
        Product p1 = new Product(1L, "Pizza", "Delicious", 120.0);
        Product p2 = new Product(2L, "Bánh kem", "Ngon", 80.0);

        when(productRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Product> result = productService.getAllProducts(); // b) Test service layer

        assertEquals(2, result.size());
        assertEquals("Pizza", result.get(0).getName());

        verify(productRepository, times(1)).findAll(); // c) Verify repository interactions
    }

    // --- Test getProduct by id success ---
    @Test
    void testGetProduct_Success() {
        Product p = new Product(1L, "Pizza", "Delicious", 120.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        Product result = productService.getProduct(1L);

        assertNotNull(result);
        assertEquals("Pizza", result.getName());

        verify(productRepository, times(1)).findById(1L);
    }

    // --- Test getProduct by id not found ---
    @Test
    void testGetProduct_NotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.getProduct(999L));
        assertTrue(exception.getMessage().contains("not found"));

        verify(productRepository, times(1)).findById(999L);
    }

    // --- Test createProduct ---
    @Test
    void testCreateProduct() {
        ProductRequest request = new ProductRequest();
        request.setName("Nước ép");
        request.setPrice(50.0);
        request.setQuantity(10);
        request.setCategory("Đồ uống");

        Product savedProduct = new Product(1L, request.getName(), "", request.getPrice());
        savedProduct.setQuantity(request.getQuantity());
        savedProduct.setCategory(request.getCategory());

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(request);

        assertNotNull(result);
        assertEquals("Nước ép", result.getName());

        verify(productRepository, times(1)).save(any(Product.class));
    }

    // --- Test updateProduct success ---
    @Test
    void testUpdateProduct() {
        Long productId = 1L;

        // Mock tồn tại (cả existsById lẫn findById nếu service dùng cả 2)
        when(productRepository.existsById(productId)).thenReturn(true);
        Product existingProduct = new Product(productId, "Pizza", "Old desc", 120.0);
        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));

        // Mock save
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Chuẩn bị request
        ProductRequest request = new ProductRequest();
        request.setName("Pizza mới");
        request.setPrice(150.0);
        request.setQuantity(20);
        request.setCategory("Món chính");

        // Gọi service
        Product result = productService.updateProduct(productId, request);

        // Kiểm tra kết quả
        assertNotNull(result);
        assertEquals("Pizza mới", result.getName());
        assertEquals(150.0, result.getPrice());
        assertEquals(20, result.getQuantity());
        assertEquals("Món chính", result.getCategory());

        // Verify interactions
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(existingProduct);
    }


    // --- Test updateProduct not found ---
    @Test
    void testUpdateProduct_NotFound() {
        Long productId = 999L;

        // a) Mock repository
        when(productRepository.existsById(productId)).thenReturn(false);

        // b) Test service layer
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.updateProduct(productId, new ProductRequest()));
        assertTrue(exception.getMessage().contains("not found"));

        // c) Verify repository interactions
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, never()).findById(anyLong());
        verify(productRepository, never()).save(any(Product.class));
    }

    // --- Test deleteProduct success ---
    @Test
    void testDeleteProduct() {
        Long productId = 1L;

        when(productRepository.existsById(productId)).thenReturn(true);
        doNothing().when(productRepository).deleteById(productId);

        productService.deleteProduct(productId);

        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }

    // --- Test deleteProduct not found ---
    @Test
    void testDeleteProduct_NotFound() {
        Long productId = 999L;

        when(productRepository.existsById(productId)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.deleteProduct(productId));
        assertTrue(exception.getMessage().contains("not found"));

        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, never()).deleteById(anyLong());
    }
}
