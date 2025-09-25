import React from "react";
import { mockClothItems } from "../MockData/mockClothItem";
import ItemGrid from "./ItemGrid";

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

const ClothItems: React.FC<ItemProps> = ({
  activeTheme,
  activeSubTab,
  likedItems,
  onItemSelect,
}) => {
  // 기존 MarketBottomSheet에 있던 'cloth' 카테고리 로직을 그대로 가져옵니다.
  const accessoryTypes = [
    "EARS",
    "EYESITEM",
    "HEAD",
    "NECK",
    "LEFTWRIST",
    "RIGHTWRIST",
    "LEFTHAND",
    "RIGHTHAND",
  ];
  const typeMap: { [key: string]: string } = {
    상의: "TOP",
    하의: "BOTTOM",
    세트: "SET",
    신발: "SHOES",
  };

  const filteredItems = mockClothItems.filter((item) => {
    if (activeTheme === "좋아요") {
      return likedItems.has(item.id);
    }
    const themeMatch =
      activeTheme === "추천" || item.theme.includes(activeTheme);

    let typeMatch = false;
    if (activeSubTab === "전체") {
      typeMatch = true;
    } else if (activeSubTab === "악세서리") {
      typeMatch = accessoryTypes.includes(item.type);
    } else {
      typeMatch = item.type === typeMap[activeSubTab];
    }

    return themeMatch && typeMatch;
  });

  return (
    <ItemGrid
      items={filteredItems}
      likedItems={likedItems}
      onItemSelect={onItemSelect}
    />
  );
};

export default ClothItems;
