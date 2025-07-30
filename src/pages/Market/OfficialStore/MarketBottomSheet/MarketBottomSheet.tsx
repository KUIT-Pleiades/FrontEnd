import React from 'react';
import s from "./MarketBottomSheet.module.scss";
import { CategoryType } from '.././OfficialUsedStore'; // 타입 임포트

interface MarketBottomSheetProps {
  activeTab: string;
  activeCategory: CategoryType;
  isCollapsed: boolean;
}

const MarketBottomSheet: React.FC<MarketBottomSheetProps> = ({ activeTab, activeCategory, isCollapsed }) => {

  const renderContent = () => {
    if (activeTab === 'official') {
      switch (activeCategory) {
        case 'face':
          return <div>공식몰 - 얼굴 아이템 목록</div>;
        case 'cloth':
          return <div>공식몰 - 의상 아이템 목록</div>;
        case 'background':
          return <div>공식몰 - 배경 아이템 목록</div>;
        default:
          return null;
      }
    } else if (activeTab === 'used') {
      switch (activeCategory) {
        case 'face':
          return <div>중고몰 - 얼굴 아이템 목록</div>;
        case 'cloth':
          return <div>중고몰 - 의상 아이템 목록</div>;
        case 'background':
          return <div>중고몰 - 배경 아이템 목록</div>;
        default:
          return null;
      }
    }
  };

  return (
    <div
      className={s.sheetContainer}
      style={{ height: isCollapsed ? "3dvh" : "" }}
    >
      <div className={s.bar}></div>
      {!isCollapsed && <div className={s.content}>{renderContent()}</div>}
    </div>
  );
};

export default MarketBottomSheet;