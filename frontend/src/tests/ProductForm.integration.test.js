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

  const sampleProductList = [
    {
      id: 100,
      name: "Cơm tấm sườn",
      description: "Cơm tấm sườn bì chả",
      price: 55,
      quantity: 20,
      category: "Món chính",
    },
    {
      id: 101,
      name: "Bún chả",
      description: "Bún chả Hà Nội",
      price: 40,
      quantity: 15,
      category: "Món chính",
    },
    {
      id: 102,
      name: "Phở bò",
      description: "Phở bò thơm ngon",
      price: 50,
      quantity: 18,
      category: "Món chính",
    },
    {
      id: 103,
      name: "Gỏi cuốn",
      description: "Gỏi cuốn tôm thịt",
      price: 30,
      quantity: 25,
      category: "Món khai vị",
    },
    {
      id: 104,
      name: "Bánh mì pate",
      description: "Bánh mì pate nóng hổi",
      price: 20,
      quantity: 10,
      category: "Bữa sáng",
    },
    {
      id: 105,
      name: "Chè đậu xanh",
      description: "Chè đậu xanh mát lạnh",
      price: 15,
      quantity: 30,
      category: "Tráng miệng",
    },
    {
      id: 106,
      name: "Trà sữa trân châu",
      description: "Trà sữa thơm ngon",
      price: 35,
      quantity: 25,
      category: "Đồ uống",
    },
    {
      id: 107,
      name: "Cà phê sữa",
      description: "Cà phê sữa đá",
      price: 25,
      quantity: 20,
      category: "Đồ uống",
    },
    {
      id: 108,
      name: "Pizza Margherita",
      description: "Pizza phô mai và cà chua",
      price: 120,
      quantity: 12,
      category: "Món chính",
    },
    {
      id: 109,
      name: "Bánh kem socola",
      description: "Bánh kem chocolate ngon",
      price: 80,
      quantity: 8,
      category: "Tráng miệng",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Xem danh sách sản phẩm", async () => {
    productService.getAllProducts.mockResolvedValue([...sampleProductList]);

    await act(async () => {
          render(<ProductPage />);
    });
    fireEvent.click(screen.getByTestId("next-btn"));
    fireEvent.click(screen.getByTestId("prev-btn"));

    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  test("Tạo sản phẩm", async () => {
    productService.getAllProducts.mockResolvedValue([]);
    productService.createProduct.mockResolvedValue(sampleProduct);

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

  test("Sửa sản phẩm", async () => {
    productService.getAllProducts.mockResolvedValue([sampleProduct]);
    productService.updateProduct.mockResolvedValue({
      ...sampleProduct,
      name:"Trà sữa",
      price:15
    });

    await act(async () => {
          render(<ProductPage />);
    });
    fireEvent.click(screen.getByTestId("edit-btn-100"));

    await waitFor(() => screen.getByLabelText(/Tên sản phẩm/i));
    fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), {
      target: { value: "Trà sữa" },
    });

    fireEvent.change(screen.getByLabelText(/Giá/i), {
      target: { value: 15 },
    });

    fireEvent.click(screen.getByRole("button", { name: /Lưu/i }));

    await waitFor(() => {
       expect(productService.updateProduct).toHaveBeenCalledWith(100, expect.objectContaining({
          name: "Trà sữa",
          price: 15,
       }));
    });
  });

  test("Xem chi tiết sản phẩm", async () => {
    productService.getAllProducts.mockResolvedValue([sampleProduct]);
    productService.getProduct.mockResolvedValue([sampleProduct]);

    await act(async () => {
          render(<ProductPage />);
    });
    fireEvent.click(screen.getByTestId("edit-btn-100"));

    await waitFor(() => screen.getByLabelText(/Tên sản phẩm/i));

    await waitFor(() => {
       expect(productService.getProduct).toHaveBeenCalledTimes(1);
    });
  });
});
