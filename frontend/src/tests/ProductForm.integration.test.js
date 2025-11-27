import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductPage from "../components/Products/Products";
import * as api from "../services/api";
//npm test -- ProductForm.integration.test.js
jest.mock("../services/api");
describe("ProductPage Integration Test", () => {
  const sampleProduct = {
    id: 1,
    name: "Pizza",
    description: "Delicious pizza",
    price: 120,
    quantity: 10,
    category: "Món chính",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new product successfully", async () => {
    api.productService.createProduct.mockResolvedValue({ ...sampleProduct, id: 100 });

    render(<ProductPage />);
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

    fireEvent.click(screen.getByRole("button", { name: /Thêm sản phẩm/i }));

    await waitFor(() => {
      expect(api.productService.createProduct).toHaveBeenCalledTimes(1);
    });
  });
});
