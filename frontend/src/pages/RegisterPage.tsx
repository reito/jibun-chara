import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    password_confirmation: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('無効な招待リンクです。');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/registrations`, {
        token: token,
        user: formData
      });

      if (response.data.status === 'success') {
        // テナントのスラッグを使用してダッシュボードに遷移
        const tenantSlug = response.data.data.tenant.slug;
        navigate(`/${tenantSlug}/dashboard`);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join('\n'));
      } else {
        setError('登録に失敗しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      backgroundColor: '#f0f7f7',
      margin: 0,
      padding: '20px',
      textAlign: 'center',
      color: '#333',
      lineHeight: 1.6,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px 30px',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(106, 193, 208, 0.1)',
        margin: '0 auto',
        maxWidth: '600px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid rgba(106, 193, 208, 0.1)'
      }}>
        <h1 style={{
          color: '#5fb5d0',
          fontSize: '28px',
          margin: '0 0 30px',
          fontWeight: 700,
          lineHeight: 1.4
        }}>
          アカウント登録
        </h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#456',
              fontSize: '16px',
              fontWeight: 500
            }}>
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#456',
              fontSize: '16px',
              fontWeight: 500
            }}>
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password_confirmation" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#456',
              fontSize: '16px',
              fontWeight: 500
            }}>
              パスワード（確認）
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#e74c3c',
              backgroundColor: '#fdf3f2',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
              color: '#fff',
              border: 'none',
              padding: '14px 25px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              width: '100%',
              maxWidth: '200px',
              boxShadow: '0 5px 15px rgba(106, 193, 208, 0.2)',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(106, 193, 208, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(106, 193, 208, 0.2)';
              }
            }}
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 