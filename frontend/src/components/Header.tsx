import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'じぶんキャラ診断' }) => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <>
      <header className="bg-[linear-gradient(135deg,#6ac1d0_0%,#5fb5d0_100%)] p-5 text-center text-white relative shadow-[0_4px_15px_rgba(106,193,208,0.2)]">
        <h1
          className="m-0 text-[24px] font-bold tracking-[1px]"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          {title}
        </h1>
      </header>

      <nav className="relative bg-white py-[10px] px-[15px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        {/* 中央: メインナビゲーション */}
        <div className="flex justify-center flex-wrap">
          <a
            href="https://blanca715.com/"
            className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
          >
            相談所トップ
          </a>
          <a
            href="https://blanca715.com/category/%e3%82%a4%e3%83%99%e3%83%b3%e3%83%88/"
            className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
          >
            イベント情報
          </a>
          <a
            href="https://blanca715.com/contact/"
            className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
          >
            無料相談予約
          </a>
          <a
            href="https://blanca715.com/achievement/"
            className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
          >
            成婚事例
          </a>
        </div>

        {/* 右端: 管理者ボタン（ログイン済み管理者のみ表示） */}
        {user && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button
              onClick={() => navigate(`/${slug}/dashboard`)}
              className="bg-[#5fb5d0] hover:bg-[#4fa5b5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>⚙️</span>
              <span>管理画面</span>
            </button>
          </div>
        )}
      </nav>
    </>
  )
}

export default Header
