package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.controller.ProductController;
import com.flogin.dto.ProductRequest;
import com.flogin.entity.Product;
import com.flogin.service.ProductService;
import com.flogin.service.UserDetailsServiceImpl;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;//print

//mvn -Dtest=ProductControllerIntegrationTest test
@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("✅ Product API Integration Tests")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private com.flogin.security.JwtRequestFilter jwtRequestFilter;



    @Autowired
    private ObjectMapper objectMapper;

// -------------------------------------------------------------
    @Test
    @DisplayName("POST /api/products - Tạo sản phẩm mới")
    void testCreateProduct() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Test product");
        request.setDescription("desc");
        request.setPrice(10.0);
        request.setQuantity(5);
        request.setCategory("Food");

        Product savedProduct = new Product("Test product", "desc", 10.0);
        savedProduct.setQuantity(5);
        savedProduct.setCategory("Food");

        when(productService.createProduct(any(ProductRequest.class)))
                .thenReturn(savedProduct);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());//isCreated 201
    }

    // -------------------------------------------------------------
    @Test
    @DisplayName("GET /api/products - Lấy danh sách sản phẩm")
    void testGetAllProducts() throws Exception {
        List<Product> products = Arrays.asList(
                new Product("Trứng chiên hành", "Cơm quê dượng bầu", 110000.0),
                new Product("Bánh xèo", "Cơm quê dượng bầu", 145000.0)
        );

        when(productService.getAllProducts()).thenReturn(products);
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Trứng chiên hành"))
                .andExpect(jsonPath("$[1].name").value("Bánh xèo"));
    }

    // -------------------------------------------------------------
    @Test
    @DisplayName("GET /api/products/{id} - Lấy 1 sản phẩm")
    void testGetOneProduct() throws Exception {

        Product product = new Product("Thịt kho tiêu", "Cơm quê dượng bầu", 150000.0);
        product.setId(1L);

        when(productService.getProduct(1L)).thenReturn(product);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Thịt kho tiêu"));
    }

    // -------------------------------------------------------------
    @Test
    @DisplayName("PUT /api/products/{id} - Cập nhật sản phẩm")
    void testUpdateProduct() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Test product");
        request.setDescription("desc");
        request.setPrice(10.0);
        request.setQuantity(5);
        request.setCategory("Đồ ăn");

        Product updated = new Product("Test product", "desc", 10.0);
        updated.setId(1L);
        updated.setQuantity(8);
        updated.setCategory("Đồ ăn");

        when(productService.updateProduct(eq(1L), any(ProductRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test product"))
                .andExpect(jsonPath("$.quantity").value(8));
    }

    // -------------------------------------------------------------
    @Test
    @DisplayName("DELETE /api/products/{id} - Xóa sản phẩm")
    void testDeleteProduct() throws Exception {

        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }
}