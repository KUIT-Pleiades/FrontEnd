import s from "./settings.module.scss";
import charater3 from "../../assets/character3.svg";
import character1body from "../../assets/character1body.svg";
import resetBtn from "../../assets/resetBtn.svg";
import { useState } from "react";

const Settings = () => {
	const [activeMenu, setActiveMenu] = useState("face");
  return (
    <>
      <div className={s.showCharacter}>
        <p className={s.pHeader}>캐릭터 꾸미기</p>
        <button className={s.nextBtn}>다음</button>
        <p className={s.pDescription}>내 캐릭터는 어떤 모습인가요?</p>
        <img className={s.characterFace} src={charater3} alt="" />
        <img className={s.characterBody} src={character1body} alt="" />
        <img className={s.resetBtn} src={resetBtn} alt="" />
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
            악세사리
          </button>
        </div>
        <div className={s.contentArea}>
          {activeMenu === "face" && <div>얼굴 선택 영역</div>}
          {activeMenu === "costume" && <div>의상 선택 영역</div>}
          {activeMenu === "accessory" && <div>악세사리 선택 영역</div>}
        </div>
      </div>
    </>
  );
};

export default Settings;
