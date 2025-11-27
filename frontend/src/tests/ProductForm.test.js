import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../components/Products/Products';

describe('Products form component', () => {
  test('shows validation errors when submitting empty form', async () => {
    render(<Products />);

    // Button text is in Vietnamese: "Thêm sản phẩm"
    const submitBtn = screen.getByRole('button', { name: /thêm sản phẩm/i });

    // Submit without filling any fields
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Tên sản phẩm không được để trống ❗/i)).toBeInTheDocument();
      expect(screen.getByText(/Vui lòng chọn category ❗/i)).toBeInTheDocument();
    });
  });

  test('submits valid form and shows success message', async () => {
    const { container } = render(<Products />);

    // Fill inputs using placeholders from the component
    fireEvent.change(screen.getByPlaceholderText(/Nhập tên sản phẩm/i), { target: { value: 'Bún bò' } });
    fireEvent.change(screen.getByPlaceholderText(/Nhập giá/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByPlaceholderText(/Nhập số lượng/i), { target: { value: '10' } });

    // Select the form category via data-cy to avoid ambiguity
    const productSelect = container.querySelector('select[data-cy="product-category"]');
    expect(productSelect).not.toBeNull();
    fireEvent.change(productSelect, { target: { value: 'Món chính' } });

    // Submit
    const buttons = screen.getAllByRole('button', { name: /thêm sản phẩm/i });
    const submitBtn = buttons[0]; // confirm index is the form button
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Thêm sản phẩm thành công ❗/i)).toBeInTheDocument();
    });
  });
});