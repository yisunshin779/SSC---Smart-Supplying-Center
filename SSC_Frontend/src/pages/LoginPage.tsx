import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosClient.post<AuthResponse>('/auth/login', {
        username,
        password,
      });

      const { token, username: loggedUser, role } = res.data;

      // Lưu phiên đăng nhập vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', loggedUser);
      localStorage.setItem('role', role);

      // Điều hướng theo đúng phân quyền
      if (role === 'ROLE_ADMIN') {
          window.location.href = '/admin';
      } else if (role === 'ROLE_SUPPLIER') {
          window.location.href = '/supplier';
      } else {
          window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.response?.data || 'Sai tên đăng nhập hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng nhập SSC</h2>
      {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#1677ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>
      </form>
      <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
        Chưa có tài khoản?{' '}
        <Link to="/register" style={{ color: '#1677ff', fontWeight: 500 }}>
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;