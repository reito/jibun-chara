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
    <div className="font-['Noto_Sans_JP',sans-serif] bg-[#f0f7f7] m-0 p-5 text-center text-[#333] leading-relaxed min-h-screen flex flex-col justify-center">
      <div className="bg-white py-10 px-[30px] rounded-[15px] shadow-[0_8px_20px_rgba(106,193,208,0.1)] mx-auto max-w-[600px] w-full box-border border border-[rgba(106,193,208,0.1)]">
        <h1 className="text-[#5fb5d0] text-[28px] m-0 mb-[30px] font-bold leading-[1.4]">
          招待リンク生成
        </h1>

        <form onSubmit={handleSubmit} className="mb-[30px]">
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-[#456] text-base font-medium"
            >
              相談所名
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full py-3 px-[15px] text-base border border-[#ddd] rounded-lg box-border transition-[border-color] duration-300 ease-[ease] bg-white"
              placeholder="例：〇〇相談所"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="slug"
              className="block mb-2 text-[#456] text-base font-medium"
            >
              URLスラッグ
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full py-3 px-[15px] text-base border border-[#ddd] rounded-lg box-border transition-[border-color] duration-300 ease-[ease] bg-white"
              placeholder="例：example"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-[#456] text-base font-medium"
            >
              相談所のメールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-3 px-[15px] text-base border border-[#ddd] rounded-lg box-border transition-[border-color] duration-300 ease-[ease] bg-white"
              placeholder="example@example.com"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] text-white border-none py-[14px] px-[25px] text-[15px] font-semibold cursor-pointer rounded-[50px] transition-all duration-300 w-full max-w-[200px] shadow-[0_5px_15px_rgba(106,193,208,0.2)]"
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
          <div className="text-[#e74c3c] bg-[#fdf3f2] p-[15px] rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="text-[#27ae60] bg-[#f0f9f4] p-[15px] rounded-lg mb-5 text-sm">
            {success}
          </div>
        )}

        {inviteUrl && (
          <div className="bg-[#f8f9fa] p-5 rounded-lg mt-5">
            <p className="m-0 mb-[10px] text-[#456] text-sm">
              招待リンク:
            </p>
            <div className="bg-white p-3 rounded-md border border-[#ddd] break-all text-sm text-[#333]">
              {inviteUrl}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Invite
