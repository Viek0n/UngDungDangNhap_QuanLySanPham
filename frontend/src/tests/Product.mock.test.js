//npx jest src/tests/Product.mock.test.js  
// src/tests/Products.mock.test.js
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Products from "../components/Products/Products";
import { productService } from "../services/api";

// Mock the ProductService
jest.mock("../services/api");

describe("Product Component - Mocked ProductService", () => {
  const mockProduct = {
    id:1,
    name: "Test Product",
    description: "test",
    price: 1,
    quantity: 1,
    category: "Món chính",
  };

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test("Mock: Create product successfully", async () => {
    productService.createProduct.mockResolvedValue(mockProduct);
    productService.getAllProducts.mockResolvedValue([]);

    await act(async () => {
      render(<Products />);
    });

    fireEvent.click(screen.getByTestId("create-btn"));

    await waitFor(() => screen.getByLabelText(/Tên sản phẩm/i));
    fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), {
      target: { value: "Test Product" },
    });

    fireEvent.change(screen.getByLabelText(/Danh mục/i), {
      target: { value: "Món chính" },
    });
    fireEvent.change(screen.getByLabelText(/Giá/i), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByLabelText(/Số lượng/i), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByLabelText(/Mô tả/i), {
      target: { value: "test" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Thêm/i }));
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith(expect.objectContaining({
        name: "Test Product",
        description: "test",
        price: 1,
        quantity: 1,
        category: "Món chính",
      }));
      expect(screen.getByText(/Thêm sản phẩm thành công ❗/i)).toBeInTheDocument();
    });
  });

  test("Mock: Create product failure", async () => {
    productService.createProduct.mockRejectedValue(new Error("Failed"));
    productService.getAllProducts.mockResolvedValue([]);

    await act(async () => {
      render(<Products />);
    });

    fireEvent.click(screen.getByTestId("create-btn"));
    await waitFor(() => screen.getByLabelText(/Tên sản phẩm/i));

    fireEvent.click(screen.getByRole("button", { name: /Thêm/i }));
    await waitFor(() => {
      expect(productService.createProduct).not.toHaveBeenCalled();
      expect(screen.getByText(/Tên sản phẩm không được để trống/i)).toBeInTheDocument();
    });
  });

  test("Mock: Get all products", async () => {
    productService.getAllProducts.mockResolvedValue([mockProduct]);

    await act(async () => {
      render(<Products />);
    });

    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
  });

  test("Mock: Update product successfully", async () => {
    productService.updateProduct.mockResolvedValue(mockProduct);
    productService.getAllProducts.mockResolvedValue([mockProduct]);

    await act(async () => {
      render(<Products />);
    });

    // Simulate edit
    fireEvent.click(screen.getByTestId("edit-btn-1"));

    fireEvent.change(screen.getByTestId("modal-name"), {
      target: { value: "Pizza Updated" },
    });

    fireEvent.click(screen.getByTestId("modal-save"));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({
        name: "Pizza Updated",
      }));
    });
  });

  test("Mock: Delete product successfully", async () => {
    productService.deleteProduct.mockResolvedValue();
    productService.getAllProducts.mockResolvedValue([mockProduct]);

    await act(async () => {
      render(<Products />);
    });

    jest.spyOn(window, "confirm").mockImplementation(() => true);

    fireEvent.click(screen.getByTestId("delete-btn-1"));

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
