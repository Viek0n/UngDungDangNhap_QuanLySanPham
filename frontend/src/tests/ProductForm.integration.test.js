import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductPage from "../components/Products/Products";
import * as api from "../services/api";

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
    api.productService.createProduct.mockResolvedValue({ ...sampleProduct, id: 2 });

    render(<ProductPage />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "New Description" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: 50 },
    });
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: 10 },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Drink" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(api.createProduct).toHaveBeenCalledTimes(1);
    });
  });

  test("should load existing product and update successfully", async () => {
    api.getProductById.mockResolvedValue(sampleProduct);
    api.updateProduct.mockResolvedValue({ ...sampleProduct, name: "Updated Name" });

    render(<ProductPage productId={1} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Product")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Updated Name" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(api.updateProduct).toHaveBeenCalledWith(1, {
        ...sampleProduct,
        name: "Updated Name",
      });
    });
  });
});
