package com.flogin.productcrup;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;

@DisplayName(" Product Service Unit Tests CRUP")
public class produvtServiceCrupTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;
    private ProductRequest productRequest;

    private Product product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        product = new Product(1L, "Laptop X1", "High-spec laptop", 1500.0, 10, "Electronics");

        productRequest = new ProductRequest();
        productRequest.setName("Laptop X1");
        productRequest.setDescription("High-spec laptop");
        productRequest.setPrice(1500.0);
        productRequest.setQuantity(10);
        productRequest.setCategory("Electronics");
    }

    @Test
    @DisplayName(" TC1a : Tao san pham moi thanh cong ")
    void testCreateProduct() {
        Product savedProduct = new Product(2L, "Smartphone Y2", "New phone", 1000.0, 5, "Electronics");

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(productRequest);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Smartphone Y2", result.getName());

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName(" TC2a : doc san pham thanh cong ")
    void testGetProduct() {
        Long productID = 1L;
        when(productRepository.findById(productID)).thenReturn(Optional.of(product));

        Product result = productService.getProduct(productID);
        assertNotNull(result);
        assertEquals(productID, result.getId());

        verify(productRepository, times(1)).findById(productID);

    }

    @Test
    @DisplayName(" TC3a : cap nhat san pham thanh cong ")
    void testUpdateProduct() {
        Long productId = 1L;

        ProductRequest updateRequest = new ProductRequest();
        updateRequest.setName("Updated Laptop");
        updateRequest.setPrice(3000.0);
        updateRequest.setQuantity(5);
        updateRequest.setCategory("Premium");
        updateRequest.setDescription("New description");

        Product updateProduct = new Product(productId, "Update Laptop", "New description", 3000.0, 5, "Premium");

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(updateProduct);

        Product result = productService.updateProduct(productId, updateRequest);

        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Update Laptop", result.getName());
        assertEquals(3000.0, result.getPrice());
        assertEquals(5, result.getQuantity());

        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));

    }

    @Test
    @DisplayName(" TC4a : xoa san pham thanh cong ")
    void testDeleteProduct() {
        Long productId = 1L;

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        productService.deleteProduct(productId);

        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).delete(product);
    }

    @Test
    @DisplayName(" TC1b : Tao san pham moi that bai ")
    void testCreateProductFail() {
        when(productRepository.save(any(Product.class))).thenThrow(new RuntimeException("DB error"));

        try {
            productService.createProduct(productRequest);
        } catch (Exception e) {
            assertEquals("DB error", e.getMessage());
        }

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName(" TC2b : doc san pham that bai ")
    void testGetProductFail() {
        Long productId = 99L;

        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        Product result = productService.getProduct(productId);

        assertNull(result);
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName(" TC3b : cap nhat san pham that bai ")
    void testUpdateProductFail() {
        Long productId = 99L;

        ProductRequest updateRequest = new ProductRequest();
        updateRequest.setName("New Name");

        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        Product result = productService.updateProduct(productId, updateRequest);

        assertNull(result);
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName(" TC4b : xoa san pham that bai ")
    void testDeleteProductFail() {
        Long productId = 99L;

        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        productService.deleteProduct(productId);

        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(0)).delete(any(Product.class));
    }
}
