import React from 'react'
import { BaseProps } from '../types'

const Admin: React.FC<BaseProps> = ({ basePath }) => {
  return (
    <div className="p-10">
      <h2>管理画面（仮）</h2>
      <p>ここに管理機能を実装します。</p>
      <p>スラッグ: {basePath}</p>
    </div>
  )
}

export default Admin
