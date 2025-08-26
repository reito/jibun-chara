import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div
      style={{
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
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px 30px',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(106, 193, 208, 0.1)',
          margin: '0 auto',
          maxWidth: '600px',
          width: '100%',
          boxSizing: 'border-box',
          border: '1px solid rgba(106, 193, 208, 0.1)',
        }}
      >
        <h1
          style={{
            color: '#5fb5d0',
            fontSize: '28px',
            margin: '0 0 30px',
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          404 - ページが見つかりません
        </h1>

        <p
          style={{
            fontSize: '16px',
            marginBottom: '30px',
            color: '#456',
            lineHeight: 1.8,
          }}
        >
          お探しのページは存在しないか、移動した可能性があります。
        </p>

        <Link
          to="/"
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
            display: 'inline-block',
            textDecoration: 'none',
            maxWidth: '200px',
            boxShadow: '0 5px 15px rgba(106, 193, 208, 0.2)',
            textAlign: 'center',
            letterSpacing: '0.5px',
            lineHeight: 1.5,
          }}
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}

export default NotFound
