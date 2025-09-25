import React from "react";
import { mockBackgroundItems } from "../MockData/mockBackgroundItem";
import ItemGrid from "./ItemGrid";
import s from "../MarketBottomSheet.module.scss"; // backgroundItem 스타일을 위해 import

interface ItemProps {
  activeTheme: string;
  activeSubTab: string;
  likedItems: Set<number>;
  onItemSelect: (
    id: number,
    name: string,
    description: string,
    price: number,
    type: string
  ) => void;
}

const BackgroundItems: React.FC<ItemProps> = ({
  activeTheme,
  activeSubTab,
  likedItems,
  onItemSelect,
}) => {
  // 기존 MarketBottomSheet에 있던 'background' 카테고리 로직을 그대로 가져옵니다.
  const typeMap: { [key: string]: string } = {
    별: "STARBACKGROUND",
    우주정거장: "STATIONBACKGROUND",
  };

  const filteredItems = mockBackgroundItems.filter((item) => {
    if (activeTheme === "좋아요") {
      return likedItems.has(item.id);
    }
    const themeMatch =
      activeTheme === "추천" || item.theme.includes(activeTheme);
    const typeMatch =
      activeSubTab === "전체" || item.type === typeMap[activeSubTab];
    return themeMatch && typeMatch;
  });

  return (
    <ItemGrid
      items={filteredItems}
      likedItems={likedItems}
      onItemSelect={onItemSelect}
      // 배경 아이템은 다른 스타일을 사용하므로, itemClassName prop을 전달합니다.
      itemClassName={s.backgroundItem}
    />
  );
};

export default BackgroundItems;
