import { validateLogin } from '../utils/validateLogin';
//npm test -- src/tests/validation.test.js --coverage
describe('validateLogin', () => {
  //username
  test('Test username rỗng', () => {
    const { isValid, errors } = validateLogin('', 'password123');
    expect(isValid).toBe(false);
    expect(errors.username).toBe('Vui lòng nhập tên đăng nhập ❗');
  });

  test('Test ký tự đặc biệt không hợp lệ', () => {
    const { isValid, errors } = validateLogin('user@123', 'password123');
    expect(isValid).toBe(false);
    expect(errors.username).toBe('Tên đăng nhập không được chứa ký tự đặc biệt ❗');
  });

  test('Test username quá ngắn/dài', () => {
    const { isValid, errors } = validateLogin('ab', 'password123');
    expect(isValid).toBe(false);
    expect(errors.username).toBe('Tên đăng nhập phải dài 3-50 ký tự ❗');
  });

  test('Test username hợp lệ', () => {
    const { isValid, errors } = validateLogin('user123', 'password123');
    expect(isValid).toBe(true);
    expect(errors.username).toBeUndefined();
  });

  //password
  test('Test password rỗng', () => {
    const { isValid, errors } = validateLogin('user123', '');
    expect(isValid).toBe(false);
    expect(errors.password).toBe('Vui lòng nhập mật khẩu ❗');
  });

  test('Test password quá ngắn/dài', () => {
    const { isValid, errors } = validateLogin('user123', 'ab123');
    expect(isValid).toBe(false);
    expect(errors.password).toBe('Mật khẩu phải dài 6-100 kí tự ❗');
  });

  test('Test password không có chữ hoặc số', () => {
    const { isValid, errors } = validateLogin('user123', '123456');
    expect(isValid).toBe(false);
    expect(errors.password).toBe('Mật khẩu phải chứa cả chữ và số ❗');
  });

  test('Test password hợp lệ', () => {
    const { isValid, errors } = validateLogin('user_01', 'pass123');
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });
});
