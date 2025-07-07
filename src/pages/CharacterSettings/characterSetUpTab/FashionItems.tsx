import { useState, useMemo, useCallback, useEffect } from "react";
import { useCharacterStore } from "../../../store/useCharacterStore";
import {
  FashionImages,
} from "../../../assets/ImageData/FashionImage";
import {
  getCategoryFromFileName,
  getMainCategory,
  getPartName,
} from "../../../constants/characterTabs";
import s from "./characterSetUptab.module.scss";

interface FashionItemsProps {
  tabs: { id: string; name: string }[];
  increaseLoadCount: () => void;
}

const FashionItems = ({ tabs, increaseLoadCount }: FashionItemsProps) => {
  const { userInfo, updateUserInfo } = useCharacterStore();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // --- [수정] 필터링 로직이 훨씬 간단해집니다. ---
  const filteredItems = useMemo(() => {
    if (activeTab === "all") {
      return FashionImages; // 항상 FashionImages 배열 하나만 사용
    }
    // 'fashion_acc' 탭이면 'fashion_acc_'로 시작하는 아이템만 필터링
    if (activeTab === "fashion_acc") {
      return FashionImages.filter((item) =>
        item.name.startsWith("fashion_acc_")
      );
    }
    // 그 외 탭들은 해당 id로 시작하는 아이템만 필터링
    return FashionImages.filter((item) =>
      getCategoryFromFileName(item.name).startsWith(activeTab)
    );
  }, [activeTab]);

  const handleItemClick = useCallback(
    (itemName: string) => {
      const mainCategory = getMainCategory(itemName);
      const partName = getPartName(itemName);

      if (!mainCategory || !partName) return;

      if (mainCategory === "outfit") {
        const typedPartName = partName as keyof typeof userInfo.outfit;
        const isEquipped = userInfo.outfit[typedPartName] === itemName;
        const newOutfit = { ...userInfo.outfit };

        const mandatoryParts = ["top", "bottom", "set", "shoes"];
        if (isEquipped && mandatoryParts.includes(typedPartName)) {
          return;
        }

        const newValue = isEquipped ? "" : itemName;

        // --- [수정] 세트 <-> 상/하의 전환 로직을 개선합니다. ---
        if (typedPartName === "set" && newValue) {
          // 1. 세트를 입을 때: 상의와 하의를 비웁니다.
          newOutfit.top = "";
          newOutfit.bottom = "";
          newOutfit.set = newValue;
        } else if (typedPartName === "top" && newValue) {
          // 2. 상의를 입을 때: 세트를 비우고, 만약 하의가 비어있다면 기본 하의를 입힙니다.
          newOutfit.set = "";
          newOutfit.top = newValue;
          if (!newOutfit.bottom) {
            newOutfit.bottom = "fashion_bottom_01.png"; // 기본 하의
          }
        } else if (typedPartName === "bottom" && newValue) {
          // 3. 하의를 입을 때: 세트를 비우고, 만약 상의가 비어있다면 기본 상의를 입힙니다.
          newOutfit.set = "";
          newOutfit.bottom = newValue;
          if (!newOutfit.top) {
            newOutfit.top = "fashion_top_01.png"; // 기본 상의
          }
        } else {
          // 4. 그 외 (신발 선택 등)
          newOutfit[typedPartName] = newValue;
        }

        updateUserInfo({ outfit: newOutfit });
      } else if (mainCategory === "item") {
        const typedPartName = partName as keyof typeof userInfo.item;
        const isEquipped = userInfo.item[typedPartName] === itemName;
        const newValue = isEquipped ? "" : itemName;
        updateUserInfo({
          item: {
            ...userInfo.item,
            [typedPartName]: newValue,
          },
        });
      }
    },
    [userInfo, updateUserInfo]
  );


  useEffect(() => {
    increaseLoadCount();
  }, [increaseLoadCount]);

  return (
    <div className={s.tabContainer}>
      <div className={s.tab}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? s.active : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className={s.tabContent}>
        <div className={s.gridItems}>
          {filteredItems.map((item) => (
            <div
              key={item.name}
              className={`${s.item} ${
                Object.values(userInfo.outfit).includes(item.name) ||
                Object.values(userInfo.item).includes(item.name)
                  ? s.selected
                  : ""
              }`}
              onClick={() => handleItemClick(item.name)}
            >
              <img src={item.src} alt={item.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FashionItems;
