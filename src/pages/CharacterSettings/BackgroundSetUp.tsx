// src/pages/CharacterSettings/BackgroundSetUp.tsx
import s from "./backgroundSetUp.module.scss";
import { useCharacterStore } from "../../store/useCharacterStore";
import openBtn from "../../assets/btnImg/openBtn.png";

import { useState } from "react";
import BackgroundTab from "./BackgroundTab";
import Pending from "../PageManagement/Pending";
import { useNavigate, useLocation } from "react-router-dom";
import { useGenerateCharacterImageMutation } from "./hooks/useGenerateCharacterImageMutation";
import { useSignupMutation } from "./hooks/useSignupMutation";
import { UserInfo } from "../../interfaces/Interfaces";

interface BackgroundSetUpProps {
  onPrev: () => void;
}

const BackgroundSetUp = ({ onPrev }: BackgroundSetUpProps) => {
  const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, updateUserInfo } = useCharacterStore();
  const [loadingState, setLoadingState] = useState(false);
	const [showList, setShowList] = useState(true);
	
	const isWearingSet = !!userInfo.outfit.set;

  const handleLoadingState = () => {
    setLoadingState(true);
  };

  const generateImageMutation = useGenerateCharacterImageMutation();
  const signupMutation = useSignupMutation(location.pathname.includes("onboarding"));

  const backgroundStyle = {
    backgroundImage: `url(${IMG_BASE_URL}${userInfo.starBackground})`,
    overflow: "hidden",
  };

  const complete = async () => {
  setLoadingState(false);

  try {
    const characterImg = await generateImageMutation.mutateAsync(userInfo);

    const signupData: UserInfo = {
      ...userInfo,
      profile: characterImg.profile,
      character: characterImg.character,
    };

    const response = await signupMutation.mutateAsync(signupData);

    if (response.message === "duplicate user") {
      console.log("회원가입 실패: 중복된 사용자");
      navigate("/login");
    } else {
      console.log("회원가입 성공");
      updateUserInfo(signupData);
      navigate("/home");
    }
  } catch (error) {
    console.error("회원가입 또는 이미지 생성 실패", error);
    navigate("/loginfail");
  }
};

  return (
    <div style={backgroundStyle} className={s.background}>
      <div className={s.dim} />
      {!loadingState && <Pending />}
      <div className={s.showCharacter} onClick={() => setShowList(false)}>
        <button className={s.previousBtn} onClick={onPrev}>
          이전
        </button>
        <p className={s.pHeader}>별 배경 선택하기</p>
        <button className={s.nextBtn} onClick={complete}>
          완료
        </button>
        <p className={s.pDescription}>
          내 캐릭터에 어울리는 배경을 골라보세요!
        </p>
        <div className={s.characterContainer}>
          <img
            className={s.characterSkin}
            src={`${IMG_BASE_URL}${userInfo.face.skinColor}.png`}
            alt="skin"
          />
          <img
            className={s.characterEyes}
            src={`${IMG_BASE_URL}${userInfo.face.eyes}.png`}
            alt="eyes"
          />
          <img
            className={s.characterNose}
            src={`${IMG_BASE_URL}${userInfo.face.nose}.png`}
            alt="nose"
          />
          <img
            className={s.characterMouth}
            src={`${IMG_BASE_URL}${userInfo.face.mouth}.png`}
            alt="mouth"
          />
          {userInfo.face.mole && (
            <img
              className={s.characterMole}
              src={`${IMG_BASE_URL}${userInfo.face.mole}.png`}
              alt="mole"
            />
          )}

          <img
            className={s.characterHair}
            src={`${IMG_BASE_URL}${userInfo.face.hair}.png`}
            alt="hair"
          />

          {!isWearingSet && (
            <>
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
            </>
          )}
          {isWearingSet && (
            <img
              className={s.characterSet}
              src={`${IMG_BASE_URL}${userInfo.outfit.set}.png`}
              alt="set"
            />
          )}

          <img
            className={s.characterShoes}
            src={`${IMG_BASE_URL}${userInfo.outfit.shoes}.png`}
            alt="shoes"
          />

          {Object.entries(userInfo.item).map(([part, src]) => {
            if (!src) return null;
            return (
              <img
                key={part}
                className={s[part]}
                src={`${IMG_BASE_URL}${src}.png`}
                alt={part}
              />
            );
          })}
        </div>
      </div>
      <div
        className={s.backgroundList}
        style={{
          transition: "transform 0.3s ease-in-out",
          transform: showList ? "translateY(0)" : "translateY(100%)",
          overflow: "hidden",
        }}
      >
        {showList && <BackgroundTab increaseLoadCount={handleLoadingState} />}
      </div>
      {!showList && (
        <div className={s.bottomBar}>
          <div className={s.openBtn} onClick={() => setShowList(true)}>
            <img
              src={openBtn}
              alt=""
              style={{ width: "14px", marginTop: "9px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSetUp;