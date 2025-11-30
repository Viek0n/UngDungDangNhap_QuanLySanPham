import { validateProduct } from "../utils/validateProduct";
//npm test -- src/tests/productValidation.test.js --coverage
describe('validateProduct', () => {
  test('name validation - empty', () => {
    const product = { name: '', price: 1000, quantity: 10, category: 'Món chính' };
    const { isValid, errors } = validateProduct(product, ['Món chính']);
    expect(isValid).toBe(false);
    expect(errors.name).toBe('Tên sản phẩm không được để trống ❗');
  });

  test('name validation - too short and too long', () => {
    const short = { name: 'ab', price: 1000, quantity: 1, category: 'Món chính' };
    const long = { name: 'a'.repeat(101), price: 1000, quantity: 1, category: 'Món chính' };

    expect(validateProduct(short, ['Món chính']).isValid).toBe(false);
    expect(validateProduct(long, ['Món chính']).isValid).toBe(false);
  });

  test('price boundary tests', () => {
    const zero = { name: 'Prod', price: 0, quantity: 1, category: 'Món chính' };
    const one = { name: 'Prod', price: 1, quantity: 1, category: 'Món chính' };
    const max = { name: 'Prod', price: 999999999, quantity: 1, category: 'Món chính' };
    const tooBig = { name: 'Prod', price: 1000000000, quantity: 1, category: 'Món chính' };

    expect(validateProduct(zero, ['Món chính']).isValid).toBe(false);
    expect(validateProduct(one, ['Món chính']).isValid).toBe(true);
    expect(validateProduct(max, ['Món chính']).isValid).toBe(true);
    expect(validateProduct(tooBig, ['Món chính']).isValid).toBe(false);
  });

  test('price non-numeric and empty', () => {
    const nanPrice = { name: 'Prod', price: 'abc', quantity: 1, category: 'Món chính' };
    const emptyPrice = { name: 'Prod', price: '', quantity: 1, category: 'Món chính' };

    expect(validateProduct(nanPrice, ['Món chính']).isValid).toBe(false);
    expect(validateProduct(emptyPrice, ['Món chính']).isValid).toBe(false);
  });

  test('quantity boundary tests', () => {
    const neg = { name: 'Prod', price: 10, quantity: -1, category: 'Món chính' };
    const zero = { name: 'Prod', price: 10, quantity: 0, category: 'Món chính' };
    const max = { name: 'Prod', price: 10, quantity: 99999, category: 'Món chính' };
    const tooMany = { name: 'Prod', price: 10, quantity: 100000, category: 'Món chính' };

    expect(validateProduct(neg, ['Món chính']).isValid).toBe(false);
    expect(validateProduct(zero, ['Món chính']).isValid).toBe(true);
    expect(validateProduct(max, ['Món chính']).isValid).toBe(true);
    expect(validateProduct(tooMany, ['Món chính']).isValid).toBe(false);
  });

  test('quantity non-numeric and empty', () => {
    const nanQty = { name: 'Prod', price: 10, quantity: 'abc', category: 'Món chính' };
    const emptyQty = { name: 'Prod', price: 10, quantity: '', category: 'Món chính' };

    expect(validateProduct(nanQty, ['Món chính']).isValid).toBe(false);
    expect(validateProduct(emptyQty, ['Món chính']).isValid).toBe(false);
  });

  test('description length validation', () => {
    const ok = { name: 'Prod', price: 10, quantity: 1, description: 'a'.repeat(500), category: 'Món chính' };
    const tooLong = { name: 'Prod', price: 10, quantity: 1, description: 'a'.repeat(501), category: 'Món chính' };

    expect(validateProduct(ok, ['Món chính']).isValid).toBe(true);
    expect(validateProduct(tooLong, ['Món chính']).isValid).toBe(false);
  });

  test('category validation', () => {
    const emptyCat = { name: 'Prod', price: 10, quantity: 1, category: '' };
    const invalidCat = { name: 'Prod', price: 10, quantity: 1, category: 'Invalid' };
    const validCat = { name: 'Prod', price: 10, quantity: 1, category: 'Đồ uống' };

    const categories = ['Món chính', 'Đồ uống'];

    expect(validateProduct(emptyCat, categories).isValid).toBe(false);
    expect(validateProduct(invalidCat, categories).isValid).toBe(false);
    expect(validateProduct(validCat, categories).isValid).toBe(true);
  });

  test('valid product returns no errors', () => {
    const product = { name: 'ComTam', price: 35000, quantity: 10, description: 'Food', category: 'Món chính' };
    const { isValid, errors } = validateProduct(product, ['Món chính']);
    expect(isValid).toBe(true);
    expect(Object.keys(errors).length).toBe(0);
  });
});