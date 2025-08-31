import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    password_confirmation: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      setError('無効な招待リンクです。')
    } else {
      setToken(tokenParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/registrations`, {
        token: token,
        user: formData,
      })

      if (response.data.status === 'success') {
        // テナントのスラッグを使用してダッシュボードに遷移
        const tenantSlug = response.data.data.tenant.slug
        navigate(`/${tenantSlug}/dashboard`)
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join('\n'))
      } else {
        setError('登録に失敗しました。')
      }
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
  }

  return (
    <div className="font-['Noto_Sans_JP',sans-serif] bg-[#f0f7f7] m-0 p-5 text-center text-[#333] leading-relaxed min-h-screen flex flex-col justify-center">
      <div className="bg-white py-10 px-[30px] rounded-[15px] shadow-[0_8px_20px_rgba(106,193,208,0.1)] mx-auto max-w-[600px] w-full box-border border border-[rgba(106,193,208,0.1)]">
        <h1 className="text-[#5fb5d0] text-[28px] m-0 mb-[30px] font-bold leading-[1.4]">
          アカウント登録
        </h1>

        <form onSubmit={handleSubmit} className="mb-[30px]">
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-[#456] text-base font-medium"
            >
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full py-3 px-[15px] text-base border border-[#ddd] rounded-lg box-border transition-[border-color] duration-300 ease-[ease] bg-white"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-[#456] text-base font-medium"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full py-3 px-[15px] text-base border border-[#ddd] rounded-lg box-border transition-[border-color] duration-300 ease-[ease] bg-white"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password_confirmation"
              className="block mb-2 text-[#456] text-base font-medium"
            >
              パスワード（確認）
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="w-full py-3 px-[15px] text-base border border-[#ddd] rounded-lg box-border transition-[border-color] duration-300 ease-[ease] bg-white"
            />
          </div>

          {error && (
            <div className="text-[#e74c3c] bg-[#fdf3f2] p-[15px] rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] text-white border-none py-[14px] px-[25px] text-[15px] font-semibold cursor-pointer rounded-[50px] transition-all duration-300 w-full max-w-[200px] shadow-[0_5px_15px_rgba(106,193,208,0.2)]"
            style={{ opacity: isLoading ? 0.7 : 1 }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow =
                  '0 8px 20px rgba(106, 193, 208, 0.3)'
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow =
                  '0 5px 15px rgba(106, 193, 208, 0.2)'
              }
            }}
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
