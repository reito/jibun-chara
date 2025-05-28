import React from 'react';

interface AdminProps {
  basePath: string;
}

const Admin: React.FC<AdminProps> = ({ basePath }) => {
  return (
    <div style={{ padding: 40 }}>
      <h2>管理画面（仮）</h2>
      <p>ここに管理機能を実装します。</p>
      <p>スラッグ: {basePath}</p>
    </div>
  );
};

export default Admin; 