import ProductPage from "../support/pages/ProductPage";

const productPage = new ProductPage();

describe('Product E2E Tests', () => {
  const product = {
      id: 1,
      name: "Pizza",
      description: "Delicious pizza",
      price: 120,
      quantity: 10,
      category: "Món chính",
  };

//   beforeEach(() => {
//     // Login và lưu token
//     cy.request('POST', 'http://localhost:8080/api/auth/login', { username: 'admin', password: 'admin123' })
//       .then((res) => {
//         const token = res.body.token;
//         cy.window().then((win) => {
//           win.localStorage.setItem('token', token);
//         });

//         // Tạo product nếu chưa có
//         cy.request({
//           method: 'POST',
//           url: 'http://localhost:8080/api/products',
//           headers: { Authorization: `Bearer ${token}` },
//           body: product,
//           failOnStatusCode: false,
//         });
//       });

//fake backend
    beforeEach(() => {
    // Stub login API
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    }).as('login');

    // Stub create/get products API
    cy.intercept('POST', '/api/products', {
      statusCode: 201,
      body: { ...product, id: 1 },
    }).as('createProduct');

    cy.intercept('GET', '/api/products', {
      statusCode: 200,
      body: [{ ...product, id: 1 }],
    }).as('getProducts');

    // "Login" by setting localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
    });

    // Vào trang /products
    productPage.visit();

    // Chờ product render
    cy.contains('.product-card h3', product.name, { timeout: 10000 }).should('exist');
  });

  //  Create 
  it('Thêm sản phẩm mới thành công', () => {
    const newProduct = { ...product, name: 'Burger' };

    productPage.getNameInput().type(newProduct.name);
    productPage.getPriceInput().type(newProduct.price.toString());
    productPage.getQuantityInput().type(newProduct.quantity.toString());
    productPage.getDescriptionInput().type(newProduct.description);
    productPage.getCategorySelect().select(newProduct.category);

    productPage.getAddButton().click();

    productPage.getSuccessMessage()
      .should('contain', 'Thêm sản phẩm thành công ❗');

    cy.contains('.product-card h3', newProduct.name, { timeout: 10000 }).should('exist');
  });

  // Validation 
  it('Hiển thị validation messages khi nhập thiếu thông tin', () => {
    productPage.getAddButton().click();

    productPage.getFieldError('name').should('contain', 'Tên sản phẩm không được để trống ❗');
    productPage.getFieldError('price').should('contain', 'Giá không được để trống ❗');
    productPage.getFieldError('quantity').should('contain', 'Số lượng không được để trống ❗');
    productPage.getFieldError('category').should('contain', 'Vui lòng chọn category ❗');
  });

  // Update 
  it('Sửa sản phẩm thành công', () => {
    const updatedPrice = 150;
    const updatedQuantity = 15;

    productPage.getEditButton(product.name).click();
    productPage.getModal().should('be.visible');

    productPage.getModalPriceInput().clear().type(updatedPrice.toString());
    productPage.getModalQuantityInput().clear().type(updatedQuantity.toString());

    productPage.getModalSaveButton().click();

    productPage.getSuccessMessage()
      .should('contain', 'Cập nhật sản phẩm thành công ❗');

    // Kiểm tra đúng product card
    productPage.getProductCardByName(product.name).within(() => {
      cy.contains(updatedPrice.toString()).should('exist');
      cy.contains(updatedQuantity.toString()).should('exist');
    });
  });

  // Delete
  it('Xóa sản phẩm thành công', () => {
    productPage.getDeleteButton(product.name).click();
    cy.on('window:confirm', () => true);

    productPage.getSuccessMessage()
      .should('contain', 'Xóa sản phẩm thành công ❗');

    cy.contains('.product-card h3', product.name).should('not.exist');
  });

 it('Tìm kiếm và lọc sản phẩm thành công', () => {
  const searchName = 'Pizza';
  const filterCategory = 'Món chính';

  // Search 
  cy.get('[data-cy="search-input"]').as('searchInput'); // tìm phần tử <input> có thuộc tính data-cy="search-input" rồi gán tên cho phần tử đó.

  cy.get('@searchInput').clear();                         // xóa trước khi nhập
  cy.get('@searchInput').type(searchName);               // xóa rồi sau đó nhập

  // Kiểm tra rằng tất cả các sản phẩm hiển thị sau khi search
  cy.contains('.product-card h3', searchName).should('exist');

  //Lọc
  cy.get('[data-cy="filter-category"]').as('filterSelect');
  cy.get('@filterSelect').select(filterCategory);

  /// Kiểm tra rằng tất cả các sản phẩm hiển thị đều thuộc danh mục đã chọn
  cy.get('.product-card').each(($el) => {
    cy.wrap($el).contains(filterCategory).should('exist');
  });
});


  // Visibility 
  it('Các ô nhập và nút thao tác có thể thấy và tương tác', () => {
    productPage.getNameInput().should('be.visible');
    productPage.getPriceInput().should('be.visible');
    productPage.getQuantityInput().should('be.visible');
    productPage.getDescriptionInput().should('be.visible');
    productPage.getCategorySelect().should('be.visible');
    productPage.getAddButton().should('be.visible');
  });
});
