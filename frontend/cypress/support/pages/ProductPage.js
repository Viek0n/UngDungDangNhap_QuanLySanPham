class ProductPage {
  visit() { 
    cy.visit("/products"); 
  }

  // Modal
  getModal() { 
    return cy.get('[data-cy="product-modal"]'); 
  }
  getModalName(){
    return cy.get('[data-cy="modal-name"]');
  }
  getModalCategory(){
    return cy.get('[data-cy="modal-category"]');
  }
  getModalDescription(){
    return cy.get('[data-cy="modal-description"]');
  }
  getModalPriceInput() { 
    return cy.get('[data-cy="modal-price"]'); 
  }
  getModalQuantityInput() { 
    return cy.get('[data-cy="modal-quantity"]'); 
  }
  getModalSaveButton() { 
    return cy.get('[data-cy="modal-save"]'); 
  }

  //Logout buttons
  getLogoutButton(){
    return cy.get('[data-cy="logout-btn"]');
  }
  // CRUD buttons
  getEditButton(productName) {
    return this.getProductCardByName(productName).find(".edit-btn");
  }
  getDeleteButton(productName) {
    return this.getProductCardByName(productName).find(".delete-btn");
  }
  getCreateButton() {
    return cy.get('[data-cy="create-btn"]');
  }
  //Search và Filter
  getSearchInput() { 
    return cy.get('input[data-cy="search-input"]'); 
  }

  getFilterCategorySelect() { 
    return cy.get('select[data-cy="filter-category"]'); 
  }

  // Messages
  getFieldError(fieldName) { 
    return cy.get(`[data-cy="modal-error-${fieldName}"], form.product-form .field-error`); 
  }
  getSuccessMessage() { 
    return cy.get('.success-message, [data-cy="success-message"]', { timeout: 10000 }); 
  }
  getErrorMessage() { 
    return cy.get('.error-message, [data-cy="error-message"]'); 
  }

  // Helpers 
  getProductCardByName(name) { 
    return cy.contains(".product-card h3", name).closest(".product-card"); 
  }
}

export default ProductPage;
