import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Products from './components/Products/Products';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <nav className="navbar">
            <button onClick={handleLogout} className="logout-btn" data-cy={`logout-btn`}>Đăng xuất</button>
          </nav>
        )}
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated 
                ? <Login onLogin={handleLogin} /> 
                : <Navigate to="/products" />
            } 
          />
          <Route 
            path="/products" 
            element={
              isAuthenticated 
                ? <Products /> 
                : <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
