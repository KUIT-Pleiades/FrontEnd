import React from "react";
import s from "../MarketBottomSheet.module.scss";
import stoneIcon from "../../../../../assets/market/stone.svg";
import heartIcon from "../../../../../assets/Icon/redHeart.svg";

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

interface Item {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
}

interface ItemGridProps {
  items: Item[];
  likedItems: Set<number>;
  onItemSelect: (
    id: number,
    name: string,
    description: string,
    price: number,
    type: string
  ) => void;
  itemClassName?: string;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  likedItems,
  onItemSelect,
  itemClassName = s.item,
}) => {
  return (
    <div className={s.gridItems}>
      {items.map((item) => (
        <div
          key={item.id}
          // 2. onClick에서 onItemSelect 호출 시 모든 인자를 전달하도록 수정합니다.
          onClick={() =>
            onItemSelect(
              item.id,
              item.name,
              item.description,
              item.price,
              item.type
            )
          }
        >
          <div className={itemClassName}>
            <img src={`${IMG_BASE_URL}${item.name}`} alt={item.name} />
            {likedItems.has(item.id) && (
              <div className={s.heartIconContainer}>
                <img src={heartIcon} alt="liked" />
              </div>
            )}
          </div>
          <div className={s.itemPrice}>
            <img src={stoneIcon} alt="stone" />
            {item.price}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
