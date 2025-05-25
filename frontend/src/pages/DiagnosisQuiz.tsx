import React from 'react';
import { useParams } from 'react-router-dom';

const DiagnosisQuiz: React.FC = () => {
  const { gender } = useParams<{ gender: string }>();

  return (
    <div>
      <h1>診断クイズ</h1>
      <p>性別: {gender}</p>
      {/* ここに診断クイズの内容を追加 */}
    </div>
  );
};

export default DiagnosisQuiz; 