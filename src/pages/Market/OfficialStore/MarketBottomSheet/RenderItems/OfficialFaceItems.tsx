import React from "react";
import ItemGrid from "./ItemGrid";
import { useOfficialFaceItems } from "../../../../../hooks/queries/useOfficialFaceItems";

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

const OfficialFaceItems: React.FC<ItemProps> = ({
  activeTheme,
  activeSubTab,
  onItemSelect,
}) => {
  const { data, isLoading, isError, error } = useOfficialFaceItems();

  if (isLoading) {
    return <div>공식몰 아이템을 불러오는 중입니다...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  // data와 그 안의 items, wishlist 속성까지 모두 확인하여 안정성을 높입니다.
  if (!data || !data.items || !data.wishlist) {
    return <div>아이템 데이터를 받아오지 못했습니다.</div>;
  }

  const typeMap: { [key: string]: string } = {
    머리: "HAIR",
    눈: "EYES",
    코: "NOSE",
    입: "MOUTH",
    점: "MOLE",
  };

  const wishlist = new Set(data.wishlist);

  const filteredItems = data.items.filter((item) => {
    if (activeTheme === "좋아요") {
      return wishlist.has(item.id);
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
      likedItems={wishlist}
      onItemSelect={onItemSelect}
    />
  );
};

export default OfficialFaceItems;
