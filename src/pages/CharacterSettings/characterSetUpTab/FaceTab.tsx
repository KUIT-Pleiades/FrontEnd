import { useState, useMemo, useEffect } from "react";
import { FaceImages, FaceItem } from "../../../assets/ImageData/FaceImage";
import { useCharacterStore } from "../../../store/useCharacterStore";
import s from "./characterSetUptab.module.scss";

export interface imgTabProps {
  increaseLoadCount: () => void;
}

const FaceTab = ({ increaseLoadCount }: imgTabProps) => {
  const [faceTab, setFaceTab] = useState("전체");
  const { userInfo, updateUserInfo } = useCharacterStore();

  const filteredFaceImages = useMemo(() => {
    if (faceTab === "전체") {
      return FaceImages;
    }
    return FaceImages.filter((image) => image.tags === faceTab);
  }, [faceTab]);

  useEffect(() => {
    const NUM_OF_IMG = filteredFaceImages.length;
    let loadedCount = 0;

    filteredFaceImages.forEach(({ src }) => {
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
  }, [filteredFaceImages, increaseLoadCount]);

  const handleImageClick = (image: FaceItem) => {
    updateUserInfo({
      face: {
        ...userInfo.face,
        [image.tags === "피부"
          ? "skinColor"
          : image.tags === "머리"
          ? "hair"
          : "expression"]: image.name,
      },
    });
  };

  return (
    <div className={s.tabContainer}>
      <div className={s.tab}>
        <button
          onClick={() => setFaceTab("전체")}
          className={faceTab === "전체" ? s.active : ""}
        >
          전체
        </button>
        <button
          className={faceTab === "피부" ? s.active : ""}
          onClick={() => setFaceTab("피부")}
        >
          피부색
        </button>
        <button
          className={faceTab === "머리" ? s.active : ""}
          onClick={() => setFaceTab("머리")}
        >
          머리
        </button>
        <button
          className={faceTab === "얼굴" ? s.active : ""}
          onClick={() => setFaceTab("얼굴")}
        >
          눈
        </button>
        <button
          className={faceTab === "코" ? s.active : ""}
          onClick={() => setFaceTab("코")}
        >
          코
        </button>
        <button
          className={faceTab === "입" ? s.active : ""}
          onClick={() => setFaceTab("입")}
        >
          입
        </button>
        <button
          className={faceTab === "점" ? s.active : ""}
          onClick={() => setFaceTab("점")}
        >
          점
        </button>
      </div>
      <div className={s.tabContent}>
        <div className={s.gridItems}>
          {filteredFaceImages.map((image) => (
            <div
              key={image.name}
              className={`${s.item} ${
                (image.tags === "피부" &&
                  image.name === userInfo.face.skinColor) ||
                (image.tags === "머리" && image.name === userInfo.face.hair) ||
                (image.tags === "얼굴" &&
                  image.name === userInfo.face.expression)
                  ? s.selected
                  : ""
              }`}
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.src}
                alt={`${image.tags} 이미지`}
                style={{
                  ...(image.tags === "머리" && {
                    transform: "scale(1.5)",
                    paddingTop: "15%",
                  }),
                  ...(image.tags === "얼굴" && {
                    transform: "scale(2)",
                    paddingTop: "15%",
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

export default FaceTab;
