import React from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>거래 내역</h1>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default TransactionHistory;
