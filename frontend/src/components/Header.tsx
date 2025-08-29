import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

interface HeaderProps {
  title?: string
}

interface NavigationItem {
  id: number
  label: string
  url: string
  position: number
  visible: boolean
}

const Header: React.FC<HeaderProps> = ({ title = 'じぶんキャラ診断' }) => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])

  useEffect(() => {
    const loadNavigationItems = async () => {
      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
        const response = await axios.get(
          `${API_BASE_URL}/tenants/${slug}/navigation_items`,
        )

        if (response.data.status === 'success' && response.data.data) {
          console.log('Header API response:', response.data.data)
          setNavigationItems(response.data.data)
        }
      } catch {
        // Navigation items loading failed, continue without them
      }
    }

    if (slug) {
      loadNavigationItems()
    }
  }, [slug])

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

      <nav className="relative bg-white py-[10px] px-[15px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] min-h-[48px] flex items-center">
        {/* 中央: メインナビゲーション */}
        <div className="flex justify-center flex-wrap flex-1">
          {navigationItems.filter(item => item.visible && item.label && item.url).length > 0 ? (
            navigationItems.filter(item => item.visible && item.label && item.url).map((item) => (
              <a
                key={item.id || item.position}
                href={item.url}
                className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap hover:text-[#4fa5b5]"
              >
                {item.label}
              </a>
            ))
          ) : (
            // ナビアイテムが0個の時も高さを保持
            <div className="h-[28px]"></div>
          )}
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
