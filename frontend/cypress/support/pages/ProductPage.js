class ProductPage {
  visit() { 
    cy.visit("/products"); 
  }

  // Form Fields
  getNameInput() { 
    return cy.get('form.product-form input[name="name"]'); 
  }
  getPriceInput() { 
    return cy.get('form.product-form input[name="price"]'); 
  }
  getQuantityInput() { 
    return cy.get('form.product-form input[name="quantity"]'); 
  }
  getDescriptionInput() { 
    return cy.get('form.product-form textarea[name="description"]'); 
  }
  getCategorySelect() { 
    return cy.get('form.product-form select[name="category"]'); 
  }
  getAddButton() { 
    return cy.get('form.product-form button[type="submit"]'); 
  }

  // Modal
  getModal() { 
    return cy.get('[data-cy="product-modal"]'); 
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

  // CRUD buttons
  getEditButton(productName) {
    return this.getProductCardByName(productName).find(".edit-btn");
  }
  getDeleteButton(productName) {
    return this.getProductCardByName(productName).find(".delete-btn");
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
