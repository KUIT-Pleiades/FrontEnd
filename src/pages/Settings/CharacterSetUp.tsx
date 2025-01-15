import s from "./CharacterSetUp.module.scss";
import characterBackground from "../../assets/backgroundImg/characterBackground.png";
import resetBtn from "../../assets/btnImg/resetBtn.svg";
//import lockImg from "../../assets/lockImg.png";
import { useState } from "react";
import { Character } from "../../interfaces/Interfaces";
import FaceTab from "./FaceTab";
// import skin01 from "../../assets/Character/face/skin/skin01.png";
// import hair01 from "../../assets/Character/face/hair/hair01.png";
// import face01 from "../../assets/Character/face/face/face01.png";
import { useCharacterStore } from "../../store/useCharacterStore";


interface CharacterSetUpProps {
  character: Character;
  onUpdateCharacter: (updates: Partial<Character>) => void
  onNext: () => void;
}

const CharacterSetUp = ({ onNext }: CharacterSetUpProps) => {
  const [activeMenu, setActiveMenu] = useState("face");
  
  const { character, resetCharacter } = useCharacterStore();

  // 레이어 순서: 액세서리>얼굴>머리>상의>하의>신발>피부
  
  //  서버에서 받아온 데이터로 캐릭터 설정하도록 바꿔야함
  // 다음 버튼 클릭 시, 다음 페이지로 이동, 현재 상태를 저장

  return (
    <div className={s.characterSetUpContainer}>
      <div className={s.showCharacter}>
        <p className={s.pHeader}>캐릭터 꾸미기</p>
        <button className={s.nextBtn} onClick={onNext}>
          다음
        </button>
        <p className={s.pDescription}>내 캐릭터는 어떤 모습인가요?</p>
        <div className={s.characterContainer}>
          <img className={s.characterSkin} src={character.face.skinColor.imgurl} alt="skin" />
          <img className={s.characterface} src={character.face.expression.imgurl} alt="face" />
          <img className={s.characterhair} src={character.face.hair.imgurl} alt="hair" />
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
          onClick={resetCharacter}
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
            의상
          </button>
          <button
            className={`${s.menuItem} ${
              activeMenu === "accessory" ? s.active : s.inactive
            }`}
            onClick={() => setActiveMenu("accessory")}
          >
            아이템
          </button>
        </div>
        <div className={s.contentArea}>
          {activeMenu === "face" && <FaceTab />}
        </div>
      </div>
    </div>
  );
};

export default CharacterSetUp;
