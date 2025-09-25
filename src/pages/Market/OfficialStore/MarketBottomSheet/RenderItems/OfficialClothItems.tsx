import React from "react";
import ItemGrid from "./ItemGrid";
import { useOfficialClothItems } from "../../../../../hooks/queries/useOfficialClothItems";

interface ItemProps {
  activeTheme: string;
  activeSubTab: string;
  onItemSelect: (
    id: number,
    name: string,
    description: string,
    price: number,
    type: string
  ) => void;
}

const OfficialClothItems: React.FC<ItemProps> = ({
  activeTheme,
  activeSubTab,
  onItemSelect,
}) => {
  const { data, isLoading, isError, error } = useOfficialClothItems();

  if (isLoading) {
    return <div>공식몰 아이템을 불러오는 중입니다...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  if (!data || !data.items || !data.wishlist) {
    return <div>아이템 데이터를 받아오지 못했습니다.</div>;
  }

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

  const wishlist = new Set(data.wishlist);

  const filteredItems = data.items.filter((item) => {
    if (activeTheme === "좋아요") {
      return wishlist.has(item.id);
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
      likedItems={wishlist}
      onItemSelect={onItemSelect}
    />
  );
};

export default OfficialClothItems;
