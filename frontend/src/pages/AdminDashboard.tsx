import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logoutUser } from '../api/auth'
import PageDesignManager from '../components/admin/PageDesignManager'

interface MenuItem {
  id: string
  label: string
  icon: string
  description: string
}

const menuItems: MenuItem[] = [
  {
    id: 'overview',
    label: 'ダッシュボード',
    icon: '🏠',
    description: 'アクセス状況や診断数などの概要を確認',
  },
  {
    id: 'page-design',
    label: 'ページ・デザイン管理',
    icon: '🎨',
    description: 'ナビゲーションやCTAボタンのカスタマイズ',
  },
  {
    id: 'account',
    label: 'アカウント情報管理',
    icon: '⚙️',
    description: '組織情報やロゴの設定',
  },
  {
    id: 'events',
    label: '会員向けイベント',
    icon: '📅',
    description: 'イベントの作成・管理',
  },
  {
    id: 'analytics',
    label: 'アクセス分析',
    icon: '📊',
    description: 'ページビューや診断完了数の確認',
  },
  {
    id: 'members',
    label: '会員管理',
    icon: '👥',
    description: 'スタッフアカウントの権限管理',
  },
]

const AdminDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, token, logout, isLoading } = useAuth()
  const [selectedMenu, setSelectedMenu] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      navigate(`/${slug}/login`)
    }
  }, [user, token, isLoading, slug, navigate])

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token)
      }
      logout()
      navigate(`/${slug}/login`)
    } catch (error) {
      console.error('Logout error:', error)
      logout()
      navigate(`/${slug}/login`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user || !token) {
    return null
  }

  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId)
    setIsSidebarOpen(false)
  }

  const renderContent = () => {
    const currentItem = menuItems.find((item) => item.id === selectedMenu)

    switch (selectedMenu) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">今日の概要</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">ページビュー</p>
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                  <p className="text-xs text-gray-500">前日比 +12%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">診断完了数</p>
                  <p className="text-2xl font-bold text-green-600">89</p>
                  <p className="text-xs text-gray-500">前日比 +5%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">CTAクリック数</p>
                  <p className="text-2xl font-bold text-purple-600">45</p>
                  <p className="text-xs text-gray-500">前日比 +8%</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">イベント参加者</p>
                  <p className="text-2xl font-bold text-orange-600">23</p>
                  <p className="text-xs text-gray-500">次回: 12/25</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">最近の活動</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-500">10:30</span>
                  <span>新規診断完了: 女性 / タイプA</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-500">09:45</span>
                  <span>イベント申込: 「婚活パーティー」に1名参加</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-500">09:15</span>
                  <span>CTAボタンクリック: 「無料相談予約」</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'page-design':
        return <PageDesignManager />

      default:
        return (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center space-x-4 mb-6">
              {currentItem && (
                <>
                  <span className="text-3xl">{currentItem.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {currentItem.label}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentItem.description}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-500">
                この機能は現在開発中です。
                <br />
                まもなく利用可能になります。
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル用メニューボタン */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white p-2 rounded-md shadow-lg"
        >
          <span className="text-xl">{isSidebarOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* サイドバー */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* ロゴ・組織名 */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">相談所管理画面</h1>
            <p className="text-sm text-gray-500 mt-1">{slug}</p>
            <div className="mt-3 p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">ログイン中:</p>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
            </div>
          </div>

          {/* メニューアイテム */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isSelected = selectedMenu === item.id
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {isSelected && <span className="text-sm">▶</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* アクションボタン */}
          <div className="px-4 py-4 border-t space-y-2">
            <button
              onClick={() => window.open(`/${slug}`, '_blank')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
            >
              <span>🔗</span>
              <span>プレビュー</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
            >
              <span>🚪</span>
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* ヘッダー */}
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {menuItems.find((item) => item.id === selectedMenu)?.label}
              </h2>
            </div>

            {/* コンテンツ */}
            {renderContent()}
          </div>
        </div>
      </div>

      {/* モバイル用オーバーレイ */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdminDashboard
