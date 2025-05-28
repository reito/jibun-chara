import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import QuizFemale from './pages/QuizFemale';
import QuizMale from './pages/QuizMale';
import Result from './pages/Result';
import Admin from './pages/Admin';
import Invite from './pages/Invite';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:slug/*" element={<MainRoutes />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/" element={<MainRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

const MainRoutes: React.FC = () => {
  const { slug } = useParams();
  const basePath = slug ? `/${slug}` : '';

  return (
    <Routes>
      <Route path="/" element={
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
              あなたの恋愛タイプ診断
            </h1>

            <p style={{
              fontSize: '16px',
              marginBottom: '30px',
              color: '#456',
              lineHeight: 1.8
            }}>
              あなたの恋愛タイプを診断して、<br />
              理想の出会いを見つけましょう！
            </p>

            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '40px'
            }}>
              <button
                onClick={() => window.location.href = `${basePath}/quiz_female`}
                style={{
                  background: '#fff',
                  border: '2px solid #ff85a2',
                  color: '#ff85a2',
                  padding: '20px 40px',
                  fontSize: '18px',
                  fontWeight: 500,
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '200px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 133, 162, 0.2)';
                  e.currentTarget.style.background = '#fff5f7';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                女性
              </button>
              <button
                onClick={() => window.location.href = `${basePath}/quiz_male`}
                style={{
                  background: '#fff',
                  border: '2px solid #4a90e2',
                  color: '#4a90e2',
                  padding: '20px 40px',
                  fontSize: '18px',
                  fontWeight: 500,
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '200px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(74, 144, 226, 0.2)';
                  e.currentTarget.style.background = '#f5f8fc';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                男性
              </button>
            </div>

            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: 'rgba(106, 193, 208, 0.05)',
              borderRadius: '10px'
            }}>
              <h2 style={{
                color: '#5fb5d0',
                fontSize: '18px',
                marginBottom: '15px'
              }}>
                診断テストの特徴
              </h2>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                textAlign: 'left'
              }}>
                <li style={{
                  marginBottom: '10px',
                  paddingLeft: '25px',
                  position: 'relative',
                  color: '#456'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#5fb5d0'
                  }}>✓</span>
                  所要時間はわずか2分程度
                </li>
                <li style={{
                  marginBottom: '10px',
                  paddingLeft: '25px',
                  position: 'relative',
                  color: '#456'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#5fb5d0'
                  }}>✓</span>
                  あなたの性格や価値観を3タイプで診断
                </li>
                <li style={{
                  marginBottom: '10px',
                  paddingLeft: '25px',
                  position: 'relative',
                  color: '#456'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#5fb5d0'
                  }}>✓</span>
                  あなたの恋愛スタイルが明確になります
                </li>
              </ul>
            </div>
          </div>
        </div>
      } />
      <Route path="quiz_female" element={<QuizFemale basePath={basePath} />} />
      <Route path="quiz_male" element={<QuizMale basePath={basePath} />} />
      <Route path="result" element={<Result basePath={basePath} />} />
      <Route path="admin" element={<Admin basePath={basePath} />} />
    </Routes>
  );
};

export default App; 