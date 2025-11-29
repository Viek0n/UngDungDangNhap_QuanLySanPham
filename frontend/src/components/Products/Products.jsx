import React, { useState, useEffect } from "react";
import "./Products.css";
import ProductModal from "./ProductModal";
import { validateProductForm } from "../../utils/validateProduct";
import { productService } from "../../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    "Món chính",
    "Tráng miệng",
    "Đồ uống",
    "Khai vị",
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts(); // make sure this returns a Promise
        setProducts(response); // assuming response.data contains the array of products
      } catch (err) {
        console.error("Error fetching products:", err);
        setErrors(err);
      } finally {
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = (products || [])
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
    .filter((p) => (filterCategory ? p.category === filterCategory : true));

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleCreate = () => {
    setSelectedProduct(null);
    setOpenForm(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
      const newProducts = products.filter((p) => p.id !== id);
      setProducts(newProducts);

      const newTotalPages = Math.ceil(newProducts.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
      }
      await productService.deleteProduct(id);
      setMessage("Xóa sản phẩm thành công ❗");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleModalSave = async (updatedProduct) => {
    const { isValid, errors: validationErrors } = validateProductForm(
      updatedProduct,
      categories
    );
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    if (selectedProduct) {
      await productService.updateProduct(updatedProduct.id, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setMessage("Cập nhật sản phẩm thành công ❗");
    } else {
      const response = await productService.createProduct(updatedProduct);
      setProducts((prev) => [...prev, { ...updatedProduct, id: response.id }]);
      setMessage("Thêm sản phẩm thành công ❗");
      setCurrentPage(totalPages);
    }

    setOpenForm(false);
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
                    data-testid={`edit-btn-${p.id}`}
                    onClick={() => handleEdit(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    data-cy={`delete-btn-${p.id}`}
                    data-testid={`delete-btn-${p.id}`}
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

      {openForm && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {setSelectedProduct(null); setOpenForm(false)}}
          onSave={handleModalSave}
          categories={categories}
        />
      )}
      <button 
        className="create-btn" 
        onClick={() => handleCreate()}
        data-testid={`create-btn`}
        data-cy={`create-btn`}
        >+</button>
    </div>
  );
}
