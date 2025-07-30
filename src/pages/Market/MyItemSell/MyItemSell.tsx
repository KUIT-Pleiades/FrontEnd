import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyItemSell: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>내 아이템 판매</h1>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default MyItemSell;
