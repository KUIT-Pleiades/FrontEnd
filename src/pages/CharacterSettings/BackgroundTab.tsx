import { useCallback, useEffect } from "react";
// --- [수정] 새로운 데이터 파일을 import 합니다. ---
import { BackgroundImages } from "../../assets/ImageData/BackgroundImage";
import { useCharacterStore } from "../../store/useCharacterStore";
import s from "./backgroundTab.module.scss";

// FaceTab에서 가져오던 타입을 제거하고, 직접 정의하거나 필요한 경우 로컬에 정의합니다.
interface BackgroundTabProps {
  increaseLoadCount: () => void;
}

const BackgroundTab = ({ increaseLoadCount }: BackgroundTabProps) => {
  const { userInfo, updateUserInfo } = useCharacterStore();

  // 이미지 로딩 로직을 더 안정적으로 수정
  useEffect(() => {
    let loadedCount = 0;
    const NUM_OF_IMG = BackgroundImages.length;

    if (NUM_OF_IMG === 0) {
      increaseLoadCount();
      return;
    }

    BackgroundImages.forEach(({ src }) => {
      const img = new Image();
      img.src = src;

      const onImageLoadOrError = () => {
        loadedCount++;
        if (loadedCount === NUM_OF_IMG) {
          increaseLoadCount();
        }
      };

      img.onload = onImageLoadOrError;
      img.onerror = () => {
        console.error(`${src} load failed`);
        onImageLoadOrError();
      };
    });
  }, [increaseLoadCount]);

  // --- [수정] 핸들러 로직이 더 간단해집니다. ---
  const handleImageClick = useCallback(
    (imageName: string) => {
      updateUserInfo({
        starBackground: imageName, // UserInfo의 속성과 정확히 일치
      });
    },
    [updateUserInfo]
  );

  return (
    <div className={s.tabContainer}>
      <div className={s.tabContent}>
        <div className={s.gridItems}>
          {BackgroundImages.map((image) => (
            <div
              key={image.name}
              className={`${s.item} ${
                image.name === userInfo.starBackground ? s.selected : ""
              }`}
              onClick={() => handleImageClick(image.name)}
            >
              <img src={image.src} alt={image.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundTab;
