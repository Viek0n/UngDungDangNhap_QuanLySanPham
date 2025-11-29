import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProductPage from "../components/Products/Products";
import { productService } from "../services/api";
//npm test -- ProductForm.integration.test.js
jest.mock("../services/api");
describe("ProductPage Integration Test", () => {
  const sampleProduct = {
      id: 100,
      name: "Cơm tấm sườn",
      description: "Cơm tấm sườn bì chả",
      price: 55,
      quantity: 20,
      category: "Món chính",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new product successfully", async () => {
    productService.getAllProducts.mockResolvedValue([]);
    productService.createProduct.mockResolvedValue({ ...sampleProduct, id: 100 });

    await act(async () => {
          render(<ProductPage />);
    });
    fireEvent.click(screen.getByTestId("create-btn"));

    await waitFor(() => screen.getByLabelText(/Tên sản phẩm/i));
    fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByLabelText(/Mô tả/i), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByLabelText(/Giá/i), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByLabelText(/Số lượng/i), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByLabelText(/Danh mục/i), {
      target: { value: "Món chính" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Thêm/i }));

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledTimes(1);
    });
  });
});
