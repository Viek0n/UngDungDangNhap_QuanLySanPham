import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login/Login';
import { authService } from '../services/api';
import { MemoryRouter } from 'react-router-dom';

// Mock authService.login
jest.mock('../services/api', () => ({
  authService: { login: jest.fn() },
}));

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
//npm test -- src/tests/Login.mock.test.js --coverage
// Render with MemoryRouter(cái này để test component dùng react-router), tại lúc không có thì nó lỗi :))) không rõ tại sao
const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Login Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Login thành công', async () => {
    authService.login.mockResolvedValueOnce({
      token: 'mock-token-123',
      user: { username: 'testuser' },
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/nhập tên đăng nhập/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu/i), {
      target: { value: 'Test123' },
    });
    fireEvent.click(screen.getByText(/đăng nhập 🔐/i));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'Test123',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/products');
    });
  });

  test('Login thất bại', async () => {
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/nhập tên đăng nhập/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu/i), {
      target: { value: 'wrongpass1' },
    });
    fireEvent.click(screen.getByText(/đăng nhập 🔐/i));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'wronguser',
        password: 'wrongpass1',
      });
      //kiểm tra result
      expect(screen.getByText(/tên đăng nhập hoặc mật khẩu không đúng/i)).toBeInTheDocument();
    });
  });
});
