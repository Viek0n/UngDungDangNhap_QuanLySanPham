import React, { useState, useEffect } from 'react';
import './Products.css';
import { validateProductForm } from '../../utils/validateProduct';
import { productService } from "../../services/api";

export default function ProductModal({product, onClose, onSave, categories }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        category: product.category || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateProductForm(form, categories);
    setErrors(validationErrors);
    if (!isValid) return;
    const updatedProduct = { ...product, ...form }
    onSave(updatedProduct);
  };


  return (
    <div className="modal-backdrop" data-cy="product-modal">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} data-cy="modal-close">
          ×
        </button>
        <h3>{product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Tên sản phẩm
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            data-cy="modal-name"
            data-testid="modal-name"
          /></label>
          {errors.name && <div className="field-error" data-cy="modal-error-name" data-testid="modal-error-name">{errors.name}</div>}

          <label>Danh mục
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            data-cy="modal-category"
            data-testid="modal-category"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select></label>
          {errors.category && <div className="field-error" data-cy="modal-error-category" data-testid="modal-error-category">{errors.category}</div>}

          <label>Giá
          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Nhập giá..."
            data-cy="modal-price"
            data-testid="modal-price"
          /></label>
          {errors.price && <div className="field-error" data-cy="modal-error-price" data-testid="modal-error-price">{errors.price}</div>}

          <label>Số lượng
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Nhập số lượng..."
            data-cy="modal-quantity"
            data-testid="modal-quantity"
          /></label>
          {errors.quantity && <div className="field-error" data-cy="modal-error-quantity" data-testid="modal-error-quantity">{errors.quantity}</div>}

          <label>Mô tả
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            data-cy="modal-description"
            data-testid="modal-description"

          /></label>
          {errors.description && <div className="field-error" data-cy="modal-error-description" data-testid="modal-error-description">{errors.description}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} data-cy="modal-cancel" data-testid="modal-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-primary" data-cy="modal-save" data-testid="modal-save">
              {product ? "Lưu":"Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
