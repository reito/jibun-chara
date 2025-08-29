import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const AdminButton: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const handleAdminClick = () => {
    navigate(`/${slug}/login`)
  }

  return (
    <button
      onClick={handleAdminClick}
      className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105"
      title="管理者画面へ"
    >
      <span>⚙️</span>
      <span>管理者</span>
    </button>
  )
}

export default AdminButton
