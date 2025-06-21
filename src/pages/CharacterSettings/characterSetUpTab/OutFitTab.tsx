import { useState, useCallback, useMemo, useEffect } from "react";
import {
  OutfitImages,
  OutfitItem,
} from "../../../assets/ImageData/OutfitImage";
import { useCharacterStore } from "../../../store/useCharacterStore";
import s from "./characterSetUptab.module.scss";
import { imgTabProps } from "./FaceTab";

const FashionTab = ({ increaseLoadCount }: imgTabProps) => {
  const [outfitTab, setOutfitTab] = useState("전체");
  const { userInfo, updateUserInfo } = useCharacterStore();

  const filteredOutfitImages = useMemo(() => {
    if (outfitTab === "전체") {
      return OutfitImages;
    }
    return OutfitImages.filter((image) => image.tags === outfitTab);
  }, [outfitTab]);

  useEffect(() => {
    const NUM_OF_IMG = filteredOutfitImages.length;
    let loadedCount = 0;

    filteredOutfitImages.forEach(({ src }) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === NUM_OF_IMG) {
          increaseLoadCount();
        }
      };

      img.onerror = () => {
        console.log(`${src} load failed`);
        loadedCount++;
        if (loadedCount === NUM_OF_IMG) {
          increaseLoadCount();
        }
      };
      console.log(loadedCount);
    });
  }, [filteredOutfitImages, increaseLoadCount]);

  const handleImageClick = useCallback(
    (image: OutfitItem) => {
      switch (image.tags) {
        case "상의":
          updateUserInfo({
            outfit: {
              ...userInfo.outfit,
              top: image.name,
            },
          });
          break;
        case "하의":
          updateUserInfo({
            outfit: {
              ...userInfo.outfit,
              bottom: image.name,
            },
          });
          break;
        case "신발":
          updateUserInfo({
            outfit: {
              ...userInfo.outfit,
              shoes: image.name,
            },
          });
          break;
      }
    },
    [userInfo.outfit, updateUserInfo]
  );

  return (
    <div className={s.tabContainer}>
      <div className={s.tab}>
        <button
          onClick={() => setOutfitTab("전체")}
          className={outfitTab === "전체" ? s.active : ""}
        >
          전체
        </button>
        <button
          onClick={() => setOutfitTab("상의")}
          className={outfitTab === "상의" ? s.active : ""}
        >
          상의
        </button>
        <button
          onClick={() => setOutfitTab("하의")}
          className={outfitTab === "하의" ? s.active : ""}
        >
          하의
        </button>
        <button
          onClick={() => setOutfitTab("세트")}
          className={outfitTab === "세트" ? s.active : ""}
        >
          세트
        </button>
        <button
          onClick={() => setOutfitTab("신발")}
          className={outfitTab === "신발" ? s.active : ""}
        >
          신발
        </button>
        <button
          onClick={() => setOutfitTab("악세서리")}
          className={outfitTab === "악세서리" ? s.active : ""}
        >
          악세서리
        </button>
      </div>
      <div className={s.tabContent}>
        <div className={s.gridItems}>
          {filteredOutfitImages.map((image) => (
            <div
              key={image.name}
              className={`${s.item} ${
                (image.tags === "상의" && image.name === userInfo.outfit.top) ||
                (image.tags === "하의" &&
                  image.name === userInfo.outfit.bottom) ||
                (image.tags === "신발" && image.name === userInfo.outfit.shoes)
                  ? s.selected
                  : ""
              }`}
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.src}
                alt={`${image.tags} 이미지`}
                style={{
                  ...(image.tags === "상의" && {
                    transform: "scale(2)",
                    paddingBottom: "40%",
                  }),
                  ...(image.tags === "하의" && {
                    transform: "scale(2)",
                    paddingBottom: "100%",
                  }),
                  ...(image.tags === "신발" && {
                    transform: "scale(4)",
                    paddingBottom: "90%",
                  }),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FashionTab;
