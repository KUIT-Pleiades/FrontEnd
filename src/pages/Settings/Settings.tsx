import set from "./Settings.module.scss";
import charater3 from "../../assets/character3.svg";
import character1body from "../../assets/character1body.svg";
import resetBtn from "../../assets/resetBtn.svg";
import { useState } from "react";

const Settings = () => {
	const [activeMenu, setActiveMenu] = useState("face");
  return (
    <>
      <div className={set.showCharacter}>
        <p className={set.pHeader}>캐릭터 꾸미기</p>
        <button className={set.nextBtn}>다음</button>
        <p className={set.pDescription}>내 캐릭터는 어떤 모습인가요?</p>
        <img className={set.characterFace} src={charater3} alt="" />
        <img className={set.characterBody} src={character1body} alt="" />
        <img className={set.resetBtn} src={resetBtn} alt="" />
      </div>
      <div className={set.setCharacter}>
        <div className={set.menuBar}>
          <button
            className={`${set.menuItem} ${
              activeMenu === "face" ? set.active : set.inactive
            }`}
            onClick={() => setActiveMenu("face")}
          >
            얼굴
          </button>
          <button
            className={`${set.menuItem} ${
              activeMenu === "costume" ? set.active : set.inactive
            }`}
            onClick={() => setActiveMenu("costume")}
          >
            의상
          </button>
          <button
            className={`${set.menuItem} ${
              activeMenu === "accessory" ? set.active : set.inactive
            }`}
            onClick={() => setActiveMenu("accessory")}
          >
            악세사리
          </button>
        </div>
        <div className={set.contentArea}>
          {activeMenu === "face" && <div>얼굴 선택 영역</div>}
          {activeMenu === "costume" && <div>의상 선택 영역</div>}
          {activeMenu === "accessory" && <div>악세사리 선택 영역</div>}
        </div>
      </div>
    </>
  );
};

export default Settings;
