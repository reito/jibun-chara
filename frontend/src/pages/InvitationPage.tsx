import React, { useState } from 'react'
import { createInvitation } from '../api/auth'
import { errorMessageStyle, errorContainerStyle } from '../styles/css'

export const InvitationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  })
  const [invitationLink, setInvitationLink] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      const response = await createInvitation(formData)
      setInvitationLink(response.data.invite_url)
    } catch (err: any) {
      if (err.message) {
        // バリデーションエラーメッセージを整形
        const errorMessages = err.message.split('\n')
        const formattedErrors: { [key: string]: string } = {}

        errorMessages.forEach((message) => {
          if (message.includes('スラッグ')) {
            formattedErrors.slug = message
          } else if (message.includes('相談所名')) {
            formattedErrors.name = message
          } else {
            formattedErrors.general = message
          }
        })

        setErrors(formattedErrors)
      } else {
        setErrors({ general: '招待リンクの生成に失敗しました。' })
      }
      console.error('Invitation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // 入力時にエラーをクリア
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div
      style={{
        maxWidth: '32rem',
        margin: '0 auto',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#1f2937',
        }}
      >
        招待リンク生成
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label
            htmlFor="name"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
            }}
          >
            相談所名を入力してください。
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
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: `1px solid ${errors.name ? '#f87171' : '#d1d5db'}`,
              outline: 'none',
              transition: 'border-color 0.15s ease-in-out',
            }}
          />
          {errors.name && <p style={errorMessageStyle}>{errors.name}</p>}
        </div>

        <div>
          <label
            htmlFor="slug"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
            }}
          >
            URLに入れたい文字列を英数字やハイフンで入力してください。
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            pattern="[a-z][a-z0-9\-]*[a-z0-9]"
            title="小文字の英字で始まり、小文字の英数字またはハイフンを含むことができます。ハイフンのみの使用はできません。"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: `1px solid ${errors.slug ? '#f87171' : '#d1d5db'}`,
              outline: 'none',
              transition: 'border-color 0.15s ease-in-out',
            }}
          />
          {errors.slug && <p style={errorMessageStyle}>{errors.slug}</p>}
        </div>

        {errors.general && (
          <div style={errorContainerStyle}>{errors.general}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease-in-out',
            opacity: isLoading ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#4338ca'
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#4f46e5'
            }
          }}
        >
          {isLoading ? '生成中...' : '招待リンクを生成'}
        </button>
      </form>

      {invitationLink && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem',
          }}
        >
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
            }}
          >
            生成された招待リンク
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={invitationLink}
              readOnly
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                outline: 'none',
              }}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(invitationLink)
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e0e7ff'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#eef2ff'
              }}
            >
              コピー
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
