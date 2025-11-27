class LoginPage {
  visit() {
    cy.visit("/login");
  }

  fillUsername(username) {
    cy.get('input[name="username"]').type(username);
  }

  fillPassword(password) {
    cy.get('input[name="password"]').type(password);
  }

  submit() {
    cy.get('button[type="submit"]').click();
  }

  getErrorMessage() {
    return cy.get(".error-message");
  }

  getUsernameInput() {
    return cy.get('input[name="username"]');
  }

  getPasswordInput() {
    return cy.get('input[name="password"]');
  }

  getLoginButton() {
    return cy.get('button[type="submit"]');
  }
  getFieldError() {
    return cy.get(".field-error");
  }
  getErrorMessage() {
    return cy.get(".error-message");
  }
}

export default LoginPage;
