import React from 'react';
import { Link } from 'react-router-dom';

const MarketHome: React.FC = () => {
  return (
    <div>
      <h1>마켓</h1>
      <nav>
        <ul>
          <li>
            <Link to="/market/official-store">공식-중고몰</Link>
          </li>
          <li>
            <Link to="/market/my-item-sell">내 아이템 판매</Link>
          </li>
          <li>
            <Link to="/market/my-product-management">내 상품 관리</Link>
          </li>
          <li>
            <Link to="/market/transaction-history">거래 내역</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MarketHome;
