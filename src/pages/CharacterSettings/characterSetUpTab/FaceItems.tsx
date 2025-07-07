import { useState, useEffect, useMemo, useCallback } from "react";
import { useCharacterStore } from "../../../store/useCharacterStore";
import { FaceImages, FaceItem } from "../../../assets/ImageData/FaceImage";
import {
  getCategoryFromFileName,
  getPartName,
} from "../../../constants/characterTabs";
import s from "./characterSetUptab.module.scss";

// CharacterSetUp.tsx로부터 props를 받기 위한 인터페이스
interface FaceItemsProps {
  tabs: { id: string; name: string }[];
  increaseLoadCount: () => void;
}

const FaceItems = ({ tabs, increaseLoadCount }: FaceItemsProps) => {
  const { userInfo, updateUserInfo } = useCharacterStore();
  // '얼굴' 탭 내의 세부 탭(전체, 피부색, 머리...) 상태를 관리합니다.
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // 현재 선택된 세부 탭에 따라 보여줄 아이템 목록을 결정합니다.
  const filteredItems = useMemo(() => {
    // '전체' 탭이면 모든 얼굴 관련 아이템을 반환합니다.
    if (activeTab === "all") {
      return FaceImages;
    }
    // 그 외의 탭이면, 파일명의 카테고리와 현재 탭의 id가 일치하는 아이템만 필터링합니다.
    // 예: activeTab이 'face_hair'이면, 'face_hair_01.png', 'face_hair_02.png' 등이 필터링됩니다.
    return FaceImages.filter((item) =>
      getCategoryFromFileName(item.name).startsWith(activeTab)
    );
  }, [activeTab]);

  // 아이템을 클릭했을 때 Zustand 스토어의 상태를 업데이트하는 함수
  const handleItemClick = useCallback(
    (item: FaceItem) => {
      const partName = getPartName(item.name);
      if (!partName) return;

      // --- [추가] 선택 해제가 가능한 파츠 목록을 정의합니다. ---
      const optionalParts = ["mole"];

      // 현재 클릭한 아이템이 이미 선택된 아이템인지 확인
      const isDeselecting =
        userInfo.face[partName as keyof typeof userInfo.face] === item.name;

      // --- [수정] 선택 해제는 optionalParts 목록에 있는 파츠만 가능하도록 변경 ---
      if (isDeselecting && !optionalParts.includes(partName)) {
        // 이미 선택된 아이템을 다시 클릭했지만, 필수 파츠(피부, 머리 등)인 경우
        // 아무것도 하지 않고 함수를 종료합니다.
        return;
      }

      updateUserInfo({
        face: {
          ...userInfo.face,
          // optionalParts는 선택 해제가 가능하고, 나머지는 항상 선택 상태를 유지합니다.
          [partName]: isDeselecting ? "" : item.name,
        },
      });
    },
    [userInfo, updateUserInfo]
  );

  // 이 컴포넌트가 화면에 보일 때 이미지 로딩 카운트를 증가시킵니다. (기존 로직 유지)
  useEffect(() => {
    increaseLoadCount();
  }, [increaseLoadCount]);

  return (
    <div className={s.tabContainer}>
      {/* 세부 탭 UI (전체, 피부색, 머리...) */}
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

      {/* 필터링된 아이템 목록 UI */}
      <div className={s.tabContent}>
        <div className={s.gridItems}>
          {filteredItems.map((item) => (
            <div
              key={item.name}
              className={`${s.item} ${
                // 현재 캐릭터가 착용하고 있는 아이템인지 확인하여 'selected' 클래스를 부여합니다.
                Object.values(userInfo.face).includes(item.name)
                  ? s.selected
                  : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              <img src={item.src} alt={item.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaceItems;
