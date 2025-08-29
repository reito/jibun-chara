import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

interface NavigationItem {
  id?: number
  label: string
  url: string
  position: number
  visible: boolean
}

interface CtaButton {
  id?: number
  title: string
  subtitle: string
  url: string
  description: string
  position: number
  visible: boolean
}

const PageDesignManager: React.FC = () => {
  const { token } = useAuth()
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([
    { label: '', url: '', position: 1, visible: true },
    { label: '', url: '', position: 2, visible: true },
    { label: '', url: '', position: 3, visible: true },
    { label: '', url: '', position: 4, visible: true },
  ])
  const [ctaButtons, setCtaButtons] = useState<CtaButton[]>([
    { title: '', subtitle: '', url: '', description: '', position: 1, visible: true },
    { title: '', subtitle: '', url: '', description: '', position: 2, visible: true },
    { title: '', subtitle: '', url: '', description: '', position: 3, visible: true },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'success' | 'error'
  >('idle')

  useEffect(() => {
    loadNavigationItems()
    loadCtaButtons()
  }, [])

  const loadNavigationItems = async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
      const response = await axios.get(`${API_BASE_URL}/navigation_items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.status === 'success') {
        const items = response.data.data
        console.log('Loaded navigation items:', items)
        const newNavigationItems = [...navigationItems]

        items.forEach((item: NavigationItem) => {
          if (item.position >= 1 && item.position <= 4) {
            newNavigationItems[item.position - 1] = {
              ...item,
              visible: item.visible !== undefined ? item.visible : true
            }
          }
        })

        console.log('Set navigation items:', newNavigationItems)
        setNavigationItems(newNavigationItems)
      }
    } catch {
      // Loading failed, continue with empty items
    }
  }

  const loadCtaButtons = async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
      const response = await axios.get(`${API_BASE_URL}/cta_buttons/admin_index`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.status === 'success') {
        const buttons = response.data.data
        console.log('Loaded CTA buttons:', buttons)
        const newCtaButtons = [...ctaButtons]
        
        buttons.forEach((button: CtaButton) => {
          if (button.position >= 1 && button.position <= 3) {
            newCtaButtons[button.position - 1] = {
              ...button,
              visible: button.visible !== undefined ? button.visible : true
            }
          }
        })
        
        console.log('Set CTA buttons:', newCtaButtons)
        setCtaButtons(newCtaButtons)
      }
    } catch (error) {
      console.error('Failed to load CTA buttons:', error)
      // Loading failed, continue with empty buttons
    }
  }

  const handleInputChange = (
    index: number,
    field: 'label' | 'url',
    value: string,
  ) => {
    setNavigationItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  const handleNavVisibilityChange = (index: number, visible: boolean) => {
    setNavigationItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, visible } : item)),
    )
  }

  const handleCtaInputChange = (
    index: number,
    field: 'title' | 'subtitle' | 'url' | 'description',
    value: string,
  ) => {
    setCtaButtons((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  const handleCtaVisibilityChange = (index: number, visible: boolean) => {
    setCtaButtons((prev) =>
      prev.map((item, i) => (i === index ? { ...item, visible } : item)),
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSaveStatus('saving')

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

      console.log('Saving navigation items:', navigationItems.map(item => ({
        label: item.label,
        url: item.url, 
        position: item.position,
        visible: item.visible
      })))
      
      const [navResponse, ctaResponse] = await Promise.all([
        axios.post(
          `${API_BASE_URL}/navigation_items/bulk_update`,
          { 
            navigation_items: navigationItems.map(item => ({
              label: item.label,
              url: item.url,
              position: item.position,
              visible: item.visible
            }))
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
        axios.post(
          `${API_BASE_URL}/cta_buttons/bulk_update`,
          { 
            cta_buttons: ctaButtons.map(button => ({
              title: button.title,
              subtitle: button.subtitle,
              url: button.url,
              description: button.description,
              position: button.position,
              visible: button.visible
            }))
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      ])

      if (navResponse.data.status === 'success' && ctaResponse.data.status === 'success') {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const getHintText = (index: number) => {
    const hints = [
      '利用者が最初に見たいページ（例：相談所トップ）',
      'イベント・セミナー情報ページ',
      '無料相談・お問い合わせページ',
      '成婚事例・会員の声ページ',
    ]
    return hints[index] || ''
  }

  return (
    <div className="space-y-6">
      {/* 説明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          ヘッダーナビゲーション設定
        </h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          ヘッダーナビには最大4つまでリンクを設定できます。
          利用者がよく使うページ（例：トップページ、イベント情報、無料相談予約、成婚事例、ブログなど）を設定するのがおすすめです。
          入力しなかった項目は表示されません。
        </p>
      </div>

      {/* フォーム */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {navigationItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-800">
                  ナビ{index + 1}
                </h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) => handleNavVisibilityChange(index, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">表示する</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ラベル（表示名）
                  </label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      handleInputChange(index, 'label', e.target.value)
                    }
                    placeholder="例）イベント情報"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    リンクURL
                  </label>
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) =>
                      handleInputChange(index, 'url', e.target.value)
                    }
                    placeholder="例）https://your-site.com/events"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">{getHintText(index)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAボタン設定 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">CTAボタン設定</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          診断結果ページに表示されるCTAボタンを設定できます。最大3つまで表示可能です。
          表示のON/OFFも選択でき、入力しなかった項目は表示されません。
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">

        <div className="space-y-6">
          {ctaButtons.map((button, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-800">
                  CTAボタン{index + 1}
                </h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={button.visible}
                    onChange={(e) => handleCtaVisibilityChange(index, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">表示する</span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メインテキスト
                    </label>
                    <input
                      type="text"
                      value={button.title}
                      onChange={(e) => handleCtaInputChange(index, 'title', e.target.value)}
                      placeholder="例）無料相談予約"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      サブテキスト
                    </label>
                    <input
                      type="text"
                      value={button.subtitle}
                      onChange={(e) => handleCtaInputChange(index, 'subtitle', e.target.value)}
                      placeholder="例）婚活に興味はあるけど不安な方へ"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    リンクURL
                  </label>
                  <input
                    type="url"
                    value={button.url}
                    onChange={(e) => handleCtaInputChange(index, 'url', e.target.value)}
                    placeholder="例）https://your-site.com/contact"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明文
                  </label>
                  <textarea
                    value={button.description}
                    onChange={(e) => handleCtaInputChange(index, 'description', e.target.value)}
                    placeholder="例）理想の出会いに向けて、あなたに合った婚活方法を提案します"
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 保存ボタン */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              saveStatus === 'success'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading
              ? '保存中...'
              : saveStatus === 'success'
                ? '保存完了 ✓'
                : saveStatus === 'error'
                  ? '保存失敗 ✗'
                  : 'ページ設定を保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageDesignManager
