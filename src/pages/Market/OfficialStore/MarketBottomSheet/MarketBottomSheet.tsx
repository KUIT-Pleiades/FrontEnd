// /src/pages/Market/OfficialStore/MarketBottomSheet/MarketBottomSheet.tsx (수정된 최종본)

import React, { useState, useEffect } from "react";
import s from "./MarketBottomSheet.module.scss";
import { CategoryType } from ".././OfficialUsedStore";
import ThemeCategoryTabs from "./ThemeCategoryTabs";
import SubCategoryTabs from "./SubCategoryTabs";

// 분리한 컴포넌트들을 import 합니다.
import FaceItems from "./RenderItems/FaceItems";
import ClothItems from "./RenderItems/ClothItems";
import BackgroundItems from "./RenderItems/BackgroundItems";

// MarketBottomSheet의 props 타입 정의는 그대로 유지합니다.
interface MarketBottomSheetProps {
  activeTab: string;
  activeCategory: CategoryType;
  isCollapsed: boolean;
  onItemSelect: (
    id: number,
    name: string,
    description: string,
    price: number,
    type: string
  ) => void;
  likedItems: Set<number>;
  isSearching?: boolean;
  reverseSearch: () => void;
  isFocus: boolean;
  setFocus: () => void;
}

const MarketBottomSheet: React.FC<MarketBottomSheetProps> = ({
  activeTab,
  activeCategory,
  isCollapsed,
  onItemSelect,
  likedItems,
  isSearching = false,
  reverseSearch,
  isFocus,
  setFocus,
}) => {
  const [activeTheme, setActiveTheme] = useState("추천");
  const [activeSubTab, setActiveSubTab] = useState("전체");

  useEffect(() => {
    setActiveSubTab("전체");
  }, [activeCategory]);

  // renderContent 함수가 매우 간결해졌습니다.
  const renderContent = () => {
    if (activeTab === "official") {
      // 공식몰 로직은 아직 구현되지 않았으므로 그대로 둡니다.
      switch (activeCategory) {
        case "face":
          return <div>공식몰 - 얼굴 아이템 목록</div>;
        case "cloth":
          return <div>공식몰 - 의상 아이템 목록</div>;
        case "background":
          return <div>공식몰 - 배경 아이템 목록</div>;
        default:
          return null;
      }
    } else if (activeTab === "used") {
      // activeCategory 값에 따라 적절한 컴포넌트를 렌더링합니다.
      // 필요한 props를 자식 컴포넌트로 전달해줍니다.
      switch (activeCategory) {
        case "face":
          return (
            <FaceItems
              activeTheme={activeTheme}
              activeSubTab={activeSubTab}
              likedItems={likedItems}
              onItemSelect={onItemSelect}
            />
          );
        case "cloth":
          return (
            <ClothItems
              activeTheme={activeTheme}
              activeSubTab={activeSubTab}
              likedItems={likedItems}
              onItemSelect={onItemSelect}
            />
          );
        case "background":
          return (
            <BackgroundItems
              activeTheme={activeTheme}
              activeSubTab={activeSubTab}
              likedItems={likedItems}
              onItemSelect={onItemSelect}
            />
          );
        default:
          return null;
      }
    }
  };

  // JSX 구조는 거의 동일합니다.
  return (
    <div
      className={`${s.sheetContainer} ${isFocus ? s.fullscreen : ""}`}
      style={{ height: isCollapsed ? "2dvh" : "" }}
    >
      <div className={s.barContainer}>
        <div className={s.bar}></div>
      </div>
      {!isCollapsed && (
        <>
          <div style={{ flexShrink: 0 }}>
            <ThemeCategoryTabs
              reverseSearch={reverseSearch}
              activeTheme={activeTheme}
              onThemeChange={setActiveTheme}
              isFocus={isFocus}
              setFocus={setFocus}
            />
            <SubCategoryTabs
              activeCategory={activeCategory}
              isSearching={isSearching}
              reverseSearch={reverseSearch}
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
              isFocus={isFocus}
              setFocus={setFocus}
            />
          </div>
          {!isSearching && <div className={s.content}>{renderContent()}</div>}
        </>
      )}
    </div>
  );
};

export default MarketBottomSheet;
