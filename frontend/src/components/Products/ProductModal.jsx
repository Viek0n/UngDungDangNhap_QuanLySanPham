import React, { useState, useEffect } from 'react';
import './Products.css';
import { validateProductForm } from "../../utils/validation";

export default function ProductModal({ product, onClose, onSave, categories }) {
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateProductForm(form, categories);
    setErrors(validationErrors);
    if (!isValid) return;
    onSave({ ...product, ...form });
  };

  if (!product) return null;

  return (
    <div className="modal-backdrop" data-cy="product-modal">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} data-cy="modal-close">
          ×
        </button>
        <h3>Cập nhật sản phẩm</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Tên sản phẩm</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            data-cy="modal-name"
          />
          {errors.name && <div className="field-error" data-cy="modal-error-name">{errors.name}</div>}

          <label>Danh mục</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            data-cy="modal-category"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <div className="field-error" data-cy="modal-error-category">{errors.category}</div>}

          <label>Giá (VND)</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Nhập giá..."
            data-cy="modal-price"
          />
          {errors.price && <div className="field-error" data-cy="modal-error-price">{errors.price}</div>}

          <label>Số lượng</label>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Nhập số lượng..."
            data-cy="modal-quantity"
          />
          {errors.quantity && <div className="field-error" data-cy="modal-error-quantity">{errors.quantity}</div>}

          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            data-cy="modal-description"
          />
          {errors.description && <div className="field-error" data-cy="modal-error-description">{errors.description}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} data-cy="modal-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-primary" data-cy="modal-save">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
