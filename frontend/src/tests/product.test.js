import React, { useEffect, useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { productService } from '../services/api';

jest.mock('../services/api', () => ({
  productService: {
    getAllProducts: jest.fn(),
    getProduct: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  },
}));

// Fake component để test
function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    productService.getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message || 'Failed to load'));
  }, []);

  return (
    <div>
      {error && <div>{error}</div>}
      {products.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}

describe('ProductService Mock Tests - Full CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /*getAllProducts*/
  test('getAllProducts success', async () => {
    const mockProducts = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }];
    productService.getAllProducts.mockResolvedValueOnce(mockProducts);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
  });

  test('getAllProducts failure', async () => {
    productService.getAllProducts.mockRejectedValueOnce(new Error('Failed to load'));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });

    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
  });

  /* getProduct*/
  test('getProduct success', async () => {
    const mockProduct = { id: 1, name: 'Apple' };
    productService.getProduct.mockResolvedValueOnce(mockProduct);

    const result = await productService.getProduct(1);
    expect(result).toEqual(mockProduct);
    expect(productService.getProduct).toHaveBeenCalledWith(1);
  });

  test('getProduct failure', async () => {
    productService.getProduct.mockRejectedValueOnce(new Error('Product not found'));

    await expect(productService.getProduct(999)).rejects.toThrow('Product not found');
    expect(productService.getProduct).toHaveBeenCalledWith(999);
  });

  /*createProduct*/
  test('createProduct success', async () => {
    const newProduct = { name: 'Orange' };
    const createdProduct = { id: 3, name: 'Orange' };
    productService.createProduct.mockResolvedValueOnce(createdProduct);

    const result = await productService.createProduct(newProduct);
    expect(result).toEqual(createdProduct);
    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
  });

  test('createProduct failure', async () => {
    const newProduct = { name: '' }; // invalid
    productService.createProduct.mockRejectedValueOnce(new Error('Invalid product data'));

    await expect(productService.createProduct(newProduct)).rejects.toThrow('Invalid product data');
    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
  });

  /*updateProduct*/
  test('updateProduct success', async () => {
    const updatedProduct = { id: 1, name: 'Green Apple' };
    productService.updateProduct.mockResolvedValueOnce(updatedProduct);

    const result = await productService.updateProduct(1, { name: 'Green Apple' });
    expect(result).toEqual(updatedProduct);
    expect(productService.updateProduct).toHaveBeenCalledWith(1, { name: 'Green Apple' });
  });

  test('updateProduct failure', async () => {
    productService.updateProduct.mockRejectedValueOnce(new Error('Update failed'));

    await expect(productService.updateProduct(999, { name: 'Test' })).rejects.toThrow('Update failed');
    expect(productService.updateProduct).toHaveBeenCalledWith(999, { name: 'Test' });
  });

  /*deleteProduct */
  test('deleteProduct success', async () => {
    productService.deleteProduct.mockResolvedValueOnce();

    await productService.deleteProduct(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
  });

  test('deleteProduct failure', async () => {
    productService.deleteProduct.mockRejectedValueOnce(new Error('Delete failed'));

    await expect(productService.deleteProduct(999)).rejects.toThrow('Delete failed');
    expect(productService.deleteProduct).toHaveBeenCalledWith(999);
  });
});
