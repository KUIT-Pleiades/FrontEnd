import s from "./CharacterSetUp.module.scss";
import characterBackground from "../../assets/backgroundImg/characterBackground.png";
import resetBtn from "../../assets/btnImg/resetBtn.svg";
import { useState } from "react";
import FaceTab from "./characterSetUpTab/FaceTab";
import { useCharacterStore } from "../../store/useCharacterStore";
import Pending from "../PageManagement/Pending";
import FashionTab from "./characterSetUpTab/OutFitTab";

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

interface CharacterSetUpProps {
  onNext: () => void;
}

const CharacterSetUp = ({ onNext }: CharacterSetUpProps) => {
  const [activeMenu, setActiveMenu] = useState("face");
  const [load, setLoad] = useState(false);
  const { userInfo, resetUserInfo } = useCharacterStore();

  const increaseLoadCount = () => {
    setLoad(true);
  };

  // 레이어 순서: 액세서리>얼굴>머리>상의>하의>신발>피부

  return (
    <div className={s.characterSetUpContainer}>
      {!load && <Pending />}
      <div className={s.showCharacter}>
        <p className={s.pHeader}>캐릭터 꾸미기</p>
        <button className={s.nextBtn} onClick={onNext}>
          다음
        </button>
        <p className={s.pDescription}>내 캐릭터는 어떤 모습인가요?</p>
        <div className={s.characterContainer}>
          <img
            className={s.characterSkin}
            src={`${IMG_BASE_URL}${userInfo.face.skinColor}.png`}
            alt="skin"
          />
          <img
            className={s.characterFace}
            src={`${IMG_BASE_URL}${userInfo.face.expression}.png`}
            alt="face"
          />
          <img
            className={s.characterHair}
            src={`${IMG_BASE_URL}${userInfo.face.hair}.png`}
            alt="hair"
          />
          <img
            className={s.characterTop}
            src={`${IMG_BASE_URL}${userInfo.outfit.top}.png`}
            alt="top"
          />
          <img
            className={s.characterBottom}
            src={`${IMG_BASE_URL}${userInfo.outfit.bottom}.png`}
            alt="bottom"
          />
          <img
            className={s.characterShoes}
            src={`${IMG_BASE_URL}${userInfo.outfit.shoes}.png`}
            alt="shoes"
          />
          {userInfo.item.head && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.head}.png`}
              alt="headItem"
            />
          )}
          {userInfo.item.eyes && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.eyes}.png`}
              alt="faceItem"
            />
          )}
          {userInfo.item.ears && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.ears}.png`}
              alt="earItem"
            />
          )}
          {userInfo.item.neck && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.neck}.png`}
              alt="neckItem"
            />
          )}
          {userInfo.item.leftWrist && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.leftWrist}.png`}
              alt="handItem"
            />
          )}
          {userInfo.item.rightWrist && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.rightWrist}.png`}
              alt="handItem"
            />
          )}
          {userInfo.item.leftHand && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.leftHand}.png`}
              alt="handItem"
            />
          )}
          {userInfo.item.rightHand && (
            <img
              className={s.characterItem}
              src={`${IMG_BASE_URL}${userInfo.item.rightHand}.png`}
              alt="handItem"
            />
          )}
        </div>
        <img
          className={s.characterBackground}
          src={characterBackground}
          alt="캐릭터후광"
        />
        <img
          className={s.resetBtn}
          src={resetBtn}
          alt="리셋 버튼"
          onClick={resetUserInfo}
        />
      </div>
      <div className={s.setCharacter}>
        <div className={s.menuBar}>
          <button
            className={`${s.menuItem} ${
              activeMenu === "face" ? s.active : s.inactive
            }`}
            onClick={() => setActiveMenu("face")}
          >
            얼굴
          </button>
          <button
            className={`${s.menuItem} ${
              activeMenu === "costume" ? s.active : s.inactive
            }`}
            onClick={() => setActiveMenu("costume")}
          >
            패션
          </button>
          
        </div>
        <div className={s.contentArea}>
          {activeMenu === "face" && (
            <FaceTab increaseLoadCount={increaseLoadCount} />
          )}
          {activeMenu === "costume" && (
            <FashionTab increaseLoadCount={increaseLoadCount} />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default CharacterSetUp;
