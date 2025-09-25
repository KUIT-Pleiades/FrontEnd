import React from "react";
import { mockFaceItems } from "../MockData/mockFaceItem"; // Mock 데이터 다시 사용
import ItemGrid from "./ItemGrid";

interface FaceItemsProps {
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

const FaceItems: React.FC<FaceItemsProps> = ({
  activeTheme,
  activeSubTab,
  likedItems,
  onItemSelect,
}) => {
  const typeMap: { [key: string]: string } = {
    머리: "HAIR",
    눈: "EYES",
    코: "NOSE",
    입: "MOUTH",
    점: "MOLE",
  };

  // 기존 Mock 데이터를 사용한 필터링 로직
  const filteredItems = mockFaceItems.filter((item) => {
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
    />
  );
};

export default FaceItems;
