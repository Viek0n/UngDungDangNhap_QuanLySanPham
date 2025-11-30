package com.flogin.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
//mvn test -Dtest=productServiceTest
@DisplayName(" Product Service Unit Tests CRUD")
public class productServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;
    private ProductRequest productRequest;

    private Product product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        product = new Product(
                1L,
                "Trứng chiên hành",
                "Món chiên dân dã",
                110000.0,
                10,
                "Món chiên");

        productRequest = new ProductRequest();
        productRequest.setName("Trứng chiên hành");
        productRequest.setDescription("Món chiên dân dã");
        productRequest.setPrice(110000.0);
        productRequest.setQuantity(10);
        productRequest.setCategory("Món chiên");
    }

    @Test
    @DisplayName("TC1a: Tạo món ăn mới thành công")
    void testCreateProduct() {
        Product savedProduct = new Product(
                2L,
                "Bún Chả",
                "Bún chả Hà Nội",
                45000.0,
                15,
                "Món nướng");

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(productRequest);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Bún Chả", result.getName());

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC2a: Đọc món ăn thành công")
    void testGetProduct() {
        Long productID = 1L;
        when(productRepository.findById(productID)).thenReturn(Optional.of(product));

        Product result = productService.getProduct(productID);
        assertNotNull(result);
        assertEquals(productID, result.getId());

        verify(productRepository, times(1)).findById(productID);
    }

    @Test
    @DisplayName("TC3a: Cập nhật món ăn thành công")
    void testUpdateProduct() {
        Long productId = 1L;

        ProductRequest updateRequest = new ProductRequest();
        updateRequest.setName("Cơm Gà");
        updateRequest.setPrice(60000.0);
        updateRequest.setQuantity(10);
        updateRequest.setCategory("Món cơm");
        updateRequest.setDescription("Cơm gà chiên giòn");

        Product updateProduct = new Product(
                productId,
                "Cơm Gà",
                "Cơm gà chiên giòn",
                60000.0,
                10,
                "Món cơm");

        when(productRepository.existsById(productId)).thenReturn(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(updateProduct);

        Product result = productService.updateProduct(productId, updateRequest);

        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Cơm Gà", result.getName());
        assertEquals(60000.0, result.getPrice());
        assertEquals(10, result.getQuantity());

        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC4a: Xóa món ăn thành công")
    void testDeleteProduct() {
        Long productId = 1L;

        when(productRepository.existsById(productId)).thenReturn(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        productService.deleteProduct(productId);

        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    @DisplayName("TC1b: Tạo món ăn mới thất bại")
    void testCreateProductFail() {

        when(productRepository.save(any(Product.class))).thenThrow(new RuntimeException("DB error"));

        Exception e = assertThrows(RuntimeException.class, () -> productService.createProduct(productRequest));
        assertEquals("DB error", e.getMessage());

        verify(productRepository, times(1)).save(any(Product.class));

    }

    @Test
    @DisplayName("TC2b: Đọc món ăn thất bại")
    void testGetProductFail() {
        Long productId = 99L;

        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            productService.getProduct(productId);
        });

        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName("TC3b: Cập nhật món ăn thất bại")
    void testUpdateProductFail() {
        Long productId = 99L;

        ProductRequest updateRequest = new ProductRequest();
        updateRequest.setName("Bánh Mì");

        when(productRepository.existsById(productId)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(productId, updateRequest);
        });

        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, never()).findById(anyLong());
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC4b: Xóa món ăn thất bại")
    void testDeleteProductFail() {
        Long productId = 99L;

        when(productRepository.existsById(productId)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            productService.deleteProduct(productId);
        });

        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(0)).deleteById(productId);
        verify(productRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("TC5a: Lấy danh sách sản phẩm thành công (Có dữ liệu)")
    void testGetAllProductsSuccess() {
        Product p2 = new Product(
                2L,
                "Bún Chả",
                "Bún chả Hà Nội",
                45000.0,
                15,
                "Món nướng");

        List<Product> mockProducts = Arrays.asList(product, p2);

        when(productRepository.findAll()).thenReturn(mockProducts);

        List<Product> result = productService.getAllProducts();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Trứng chiên hành", result.get(0).getName());
        assertEquals("Bún Chả", result.get(1).getName());
        verify(productRepository, times(1)).findAll();
    }

}
