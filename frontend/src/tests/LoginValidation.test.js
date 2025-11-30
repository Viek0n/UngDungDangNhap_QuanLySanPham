import { validateLoginForm } from '../utils/validateLogin';

describe('validateLoginForm', () => {
  test('should return error when username is empty', () => {
    const { isValid, errors } = validateLoginForm('', 'password123');
    expect(isValid).toBe(false);
    expect(errors.username).toBe('Vui lòng nhập tên đăng nhập ❗');
  });

  test('should return error when username contains special chars', () => {
    const { isValid, errors } = validateLoginForm('user@123', 'password123');
    expect(isValid).toBe(false);
    expect(errors.username).toBe('Tên đăng nhập không được chứa ký tự đặc biệt ❗');
  });

  test('should return error when password is empty', () => {
    const { isValid, errors } = validateLoginForm('user123', '');
    expect(isValid).toBe(false);
    expect(errors.password).toBe('Vui lòng nhập mật khẩu ❗');
  });

  test('should return error when password is too short', () => {
    const { isValid, errors } = validateLoginForm('user123', '123');
    expect(isValid).toBe(false);
    expect(errors.password).toBe('Mật khẩu phải có ít nhất 6 ký tự ❗');
  });

  test('should be valid for correct inputs', () => {
    const { isValid, errors } = validateLoginForm('user_01', 'pass123');
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });
});
