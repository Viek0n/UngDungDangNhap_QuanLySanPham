import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login/Login';
import { authService } from '../services/api';
import { BrowserRouter } from 'react-router-dom';

// mock axios
//Nếu ghi là jest.mock('axios');
//thì const api = axios.create(); // api = undefined
//api.interceptors.request.use(...) // error

// Mock authService
jest.mock('../services/api', () => ({
  authService: {
    login: jest.fn()
  }
}));


const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders inputs and submit button', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/Tên đăng nhập/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
  });

  test('shows validation errors and does not call API', async () => {
    renderWithRouter(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
    expect(await screen.findByText(/Vui lòng nhập tên đăng nhập ❗/i)).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  test('successful login: stores token and navigates', async () => {
    const fakeResponse = { token: 'abc123' };
    authService.login.mockResolvedValueOnce(fakeResponse);

    // mock onLogin
    const onLogin = jest.fn();

    renderWithRouter(<Login onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/Tên đăng nhập/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), { target: { value: 'admin123' } });

    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({ username: 'admin', password: 'admin123' });
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('abc123');
      expect(onLogin).toHaveBeenCalled();
      // Router navigation is not directly asserted here — we assume route change occurs.
    });
  });

  test('shows server error message on failed login', async () => {
    authService.login.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Tên đăng nhập/i), { target: { value: 'user123' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    expect(await screen.findByText(/Tên đăng nhập hoặc mật khẩu không đúng ❌/i)).toBeInTheDocument();
  });
});
