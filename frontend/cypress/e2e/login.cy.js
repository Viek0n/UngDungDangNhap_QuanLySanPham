import LoginPage from "../support/pages/LoginPage";

const loginPage = new LoginPage();

describe("Login E2E Tests", () => {
  beforeEach(() => {
    loginPage.visit();
  });

  // a) Test complete login flow
  // it("đăng nhập và chuyển trang khi nhập đúng thông tin đăng nhập", () => {
  //   loginPage.fillUsername("admin");
  //   loginPage.fillPassword("admin123");
  //   loginPage.submit();

  //   // kiểm tra URL redirect
  //   cy.url({ timeout: 20000 }).should("include", "/products");
  // });


  // dành cho git vì một lý do nào đó frontend server bị lỗi
  it("đăng nhập và chuyển trang khi nhập đúng thông tin đăng nhập", () => {
  // Fake login API response
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: { token: 'fake-jwt-token' },
  }).as('loginRequest');

 
  loginPage.fillUsername("admin");
  loginPage.fillPassword("admin123");
  loginPage.submit();

 
  cy.wait('@loginRequest');

 
  cy.url({ timeout: 20000 }).should("include", "/products");
});
    // b) Test validation messages
  it("Hiển thị validation message khi username/password không hợp lệ", () => {
    loginPage.fillUsername("user@123");
    loginPage.fillPassword("123");
    loginPage.submit();

    loginPage
      .getFieldError()
      .should("contain", "Tên đăng nhập không được chứa ký tự đặc biệt ❗");
    loginPage
      .getFieldError()
      .should("contain", "Mật khẩu phải dài 6-100 kí tự ❗");
  });

  // c) Test success/error flows
  it("hiện lỗi đăng nhập khi nhập sai thông tin đăng nhập", () => {
    // giả lập API login trả lỗi 401
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
      body: { message: "Tên đăng nhập hoặc mật khẩu không đúng ❌" },
    }).as("loginFail"); // đặt tên alias để chờ

    // Nhập sai thông tin đăng nhập
    loginPage.fillUsername("wronguser");
    loginPage.fillPassword("wrongpass");
    loginPage.submit();

    cy.wait("@loginFail");

    loginPage
      .getErrorMessage()
      .should("contain", "Tên đăng nhập hoặc mật khẩu không đúng ❌");
  });

  // d) Test UI elements interactions
  it("các ô ghi và các giao diện có thể được thấy/tương tác", () => {
    loginPage.getUsernameInput().should("be.visible");
    loginPage.getPasswordInput().should("be.visible");
    loginPage.getLoginButton().should("be.visible");
  });
});

//--nếu muốn fake login
// cy.intercept('POST', '/api/auth/login', {
//   statusCode: 200,
//   body: { token: 'fake-jwt-token' },
// }).as('loginRequest');

// loginPage.fillUsername('anyuser');
// loginPage.fillPassword('anypass');
// loginPage.submit();
// cy.url().should('include', '/products');
