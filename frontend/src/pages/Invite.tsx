import React, { useState } from 'react'
import { BaseProps } from '../types'
import client from '../api/client'

const Invite: React.FC<BaseProps> = ({ basePath: _basePath }) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [inviteUrl, setInviteUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await client.post('/invitations', {
        tenant: {
          name,
          slug,
          admin_email: email,
        },
      })
      setInviteUrl(response.data.data.invite_url)
      setSuccess(
        '招待リンクが生成されました。以下のリンクを相談所運営者に送付してください。',
      )
    } catch (error: any) {
      console.error('Full error object:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)

      if (error.response?.data?.errors) {
        setError(error.response.data.errors.join(', '))
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.message) {
        setError(error.message)
      } else {
        setError('招待リンクの生成に失敗しました。')
      }
    }
  }

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
          招待リンク生成
        </h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#456',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              相談所名
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease',
                backgroundColor: '#fff',
              }}
              placeholder="例：〇〇相談所"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="slug"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#456',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              URLスラッグ
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease',
                backgroundColor: '#fff',
              }}
              placeholder="例：example"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#456',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              相談所のメールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease',
                backgroundColor: '#fff',
              }}
              placeholder="example@example.com"
            />
          </div>

          <button
            type="submit"
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
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow =
                '0 8px 20px rgba(106, 193, 208, 0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow =
                '0 5px 15px rgba(106, 193, 208, 0.2)'
            }}
          >
            招待リンクを生成
          </button>
        </form>

        {error && (
          <div
            style={{
              color: '#e74c3c',
              backgroundColor: '#fdf3f2',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              color: '#27ae60',
              backgroundColor: '#f0f9f4',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {success}
          </div>
        )}

        {inviteUrl && (
          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginTop: '20px',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                color: '#456',
                fontSize: '14px',
              }}
            >
              招待リンク:
            </p>
            <div
              style={{
                backgroundColor: '#fff',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                wordBreak: 'break-all',
                fontSize: '14px',
                color: '#333',
              }}
            >
              {inviteUrl}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Invite
