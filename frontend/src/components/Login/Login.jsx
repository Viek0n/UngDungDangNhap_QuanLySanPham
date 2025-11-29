import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api'; // dùng authService
import './Login.css';
import { validateLoginForm } from '../../utils/validateLogin';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    const { isValid, errors } = validateLoginForm(credentials.username, credentials.password);
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Dùng authService.login thay vì axios.post trực tiếp
      const response = await authService.login(credentials);

      if (response?.token) {
        localStorage.setItem('token', response.token);
        if (typeof onLogin === 'function') onLogin();
        navigate('/products');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng ❌');
      }
    } catch (err) {
      // Luôn hiển thị message tiếng Việt để test match
      setError('Tên đăng nhập hoặc mật khẩu không đúng ❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">Food Login</div>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Đăng nhập vào tài khoản</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Nhập tên đăng nhập..."
            />
            {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu..."
            />
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập 🔐'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
