import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyProductManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>내 상품 관리</h1>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default MyProductManagement;
