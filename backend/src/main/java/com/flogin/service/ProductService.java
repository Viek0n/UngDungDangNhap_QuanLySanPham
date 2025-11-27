package com.flogin.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.flogin.dto.ProductRequest;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

public Product createProduct(ProductRequest request) {
    Product product = new Product(
            request.getName(),
            request.getDescription(),
            request.getPrice());
    product.setQuantity(request.getQuantity());
    product.setCategory(request.getCategory()); 
    return productRepository.save(product);
}


public Product updateProduct(Long id, ProductRequest request) {
    if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
    Product product = getProduct(id);
    product.setName(request.getName());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setQuantity(request.getQuantity());
    product.setCategory(request.getCategory()); 
    return productRepository.save(product);
}
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public Page<Product> getProductsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

   


}