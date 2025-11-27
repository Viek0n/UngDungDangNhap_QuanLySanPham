import React, { useState } from "react";
import "./Products.css";
import ProductModal from "./ProductModal";
import { validateProductForm } from "../../utils/validation";

export default function Products() {
  const [products, setProducts] = useState([
    // Món chính
    {
      id: 1,
      name: "Cơm tấm sườn",
      description: "Cơm tấm sườn bì chả",
      price: 55,
      quantity: 20,
      category: "Món chính",
    },
    {
      id: 2,
      name: "Mì xào bò",
      description: "Mì xào bò rau củ",
      price: 50,
      quantity: 15,
      category: "Món chính",
    },
    {
      id: 3,
      name: "Gà rán",
      description: "Gà rán giòn cay",
      price: 65,
      quantity: 18,
      category: "Món chính",
    },

    // Tráng miệng
    {
      id: 4,
      name: "Bánh flan",
      description: "Flan caramel mềm mịn",
      price: 20,
      quantity: 12,
      category: "Tráng miệng",
    },
    {
      id: 5,
      name: "Chè khúc bạch",
      description: "Chè khúc bạch thơm mát",
      price: 28,
      quantity: 14,
      category: "Tráng miệng",
    },
    {
      id: 6,
      name: "Kem dừa",
      description: "Kem dừa tươi béo nhẹ",
      price: 22,
      quantity: 10,
      category: "Tráng miệng",
    },
    {
      id: 7,
      name: "Bánh su kem",
      description: "Su kem mềm béo",
      price: 18,
      quantity: 16,
      category: "Tráng miệng",
    },

    // Đồ uống
    {
      id: 8,
      name: "Trà đào",
      description: "Trà đào miếng thơm mát",
      price: 30,
      quantity: 25,
      category: "Đồ uống",
    },
    {
      id: 9,
      name: "Nước cam",
      description: "Nước cam nguyên chất",
      price: 32,
      quantity: 20,
      category: "Đồ uống",
    },
    {
      id: 10,
      name: "Sinh tố xoài",
      description: "Sinh tố xoài tươi",
      price: 35,
      quantity: 15,
      category: "Đồ uống",
    },
    {
      id: 11,
      name: "Soda bạc hà",
      description: "Soda vị bạc hà mát lạnh",
      price: 28,
      quantity: 18,
      category: "Đồ uống",
    },

    // Khai vị
    {
      id: 12,
      name: "Khoai tây chiên",
      description: "Khoai chiên giòn rụm",
      price: 25,
      quantity: 22,
      category: "Khai vị",
    },
    {
      id: 13,
      name: "Gỏi cuốn",
      description: "Gỏi cuốn tôm thịt",
      price: 30,
      quantity: 12,
      category: "Khai vị",
    },
    {
      id: 14,
      name: "Súp ngô",
      description: "Súp ngô kem ngọt",
      price: 27,
      quantity: 10,
      category: "Khai vị",
    },
    {
      id: 15,
      name: "Bánh mì bơ tỏi",
      description: "Bánh mì nướng bơ tỏi thơm",
      price: 22,
      quantity: 14,
      category: "Khai vị",
    },
  ]);


  const [categories] = useState([
    "Món chính",
    "Tráng miệng",
    "Đồ uống",
    "Khai vị",
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [message, setMessage] = useState("");

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
    .filter((p) => (filterCategory ? p.category === filterCategory : true));

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateProductForm(
      form,
      categories
    );
    setErrors(validationErrors);
    if (!isValid) return;

    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...form, id: p.id } : p
        )
      );
      setMessage("Cập nhật sản phẩm thành công ❗");
    } else {
      setProducts((prev) => [...prev, { ...form, id: Date.now() }]);
      setMessage("Thêm sản phẩm thành công ❗");
    }

    setForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
    });
    setSelectedProduct(null);
    setCurrentPage(totalPages);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
      const newProducts = products.filter((p) => p.id !== id);
      setProducts(newProducts);

      const newTotalPages = Math.ceil(newProducts.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
      }

      setMessage("Xóa sản phẩm thành công ❗");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleModalSave = (updatedProduct) => {
    const { isValid, errors: validationErrors } = validateProductForm(
      updatedProduct,
      categories
    );
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    setMessage("Cập nhật sản phẩm thành công ❗");
    setSelectedProduct(null);
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="products-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Thêm / Sửa Sản Phẩm</h2>

        <div className="form-row">
          <div className={`form-group ${errors.name ? "has-error" : ""}`}>
            <label>Tên sản phẩm</label>
            <input
              name="name"
              value={form.name}
              data-cy="product-name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nhập tên sản phẩm..."
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className={`form-group ${errors.category ? "has-error" : ""}`}>
            <label>Danh mục</label>
            <select
              name="category"
              className="food-select"
              data-cy="product-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="field-error">{errors.category}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className={`form-group ${errors.price ? "has-error" : ""}`}>
            <label>Giá (VND)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              data-cy="product-price"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Nhập giá..."
              className="price-input"
            />
            {errors.price && <div className="field-error">{errors.price}</div>}
          </div>

          <div className={`form-group ${errors.quantity ? "has-error" : ""}`}>
            <label>Số lượng</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              data-cy="product-quantity"
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="Nhập số lượng..."
              className="price-input"
            />
            {errors.quantity && (
              <div className="field-error">{errors.quantity}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            className="food-description"
            value={form.description}
            data-cy="product-description"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Mô tả sản phẩm (tùy chọn)..."
          />
          {errors.description && (
            <div className="field-error">{errors.description}</div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" data-cy="submit-btn">
            {selectedProduct ? "Cập nhật" : "Thêm sản phẩm"}
          </button>
        </div>
      </form>

      {message && <div className="success-message">{message}</div>}

      <div className="form-row" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          className="custom-name-input"
          placeholder="Tìm kiếm sản phẩm..."
          data-cy="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="food-select"
          data-cy="filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">-- Lọc theo danh mục --</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="products-list">
        {currentProducts.length === 0 ? (
          <p>Không có sản phẩm phù hợp.</p>
        ) : (
          currentProducts.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-content">
                <h3>{p.name}</h3>
                <div className="description">
                  {p.description || "Không có mô tả"}
                </div>
                <div className="price">{p.price.toLocaleString()} ₫</div>
                <div className="description">Số lượng: {p.quantity}</div>
                <div className="description">Danh mục: {p.category}</div>
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    data-cy={`edit-btn-${p.id}`}
                    onClick={() => handleEdit(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    data-cy={`delete-btn-${p.id}`}
                    onClick={() => handleDelete(p.id)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredProducts.length > itemsPerPage && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={handlePrev}>
            Prev
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleModalSave}
          categories={categories}
        />
      )}
    </div>
  );
}
