import Calendar from "react-calendar";
import s from "./profileSetUp.module.scss";
import characterBackground from "../../assets/backgroundImg/characterBackground.png";
import React, { useState, useCallback } from "react";
import { useCharacterStore } from "../../store/useCharacterStore";
import { useIdCheckQuery } from "./hooks/useUserCharacterQuery"; // 새 훅 사용

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

interface ProfileSetUpProps {
  onNext: () => void;
  onPrev: () => void;
}

const ProfileSetUp = ({ onNext, onPrev }: ProfileSetUpProps) => {
  const { userInfo, updateUserInfo } = useCharacterStore();
  const [isValidId, setIsValidId] = useState<boolean>(false);
  const [isIdChecked, setIsIdChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPokePopupVisible, setIsPokePopupVisible] = useState(false);
  const [buttonText, setButtonText] = useState("중복확인");

  type DatePiece = Date | null;
  type SelectedDate = DatePiece | [DatePiece, DatePiece];

  const defaultDate = new Date("2000-01-01");
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(defaultDate);

  // TanStack Query hook
  const {
    data: idCheckData,
    refetch,
    isFetching
  } = useIdCheckQuery(userInfo.userId || "", false);

	const isWearingSet = !!userInfo.outfit.set;

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value.trim();
      if (newName.length <= 15) {
        updateUserInfo({ userName: newName });
      }
    },
    [updateUserInfo]
  );

  const validateId = (id: string): boolean => {
    const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,10}$/;
    return idRegex.test(id);
  };

  const handleIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newId = e.target.value;
      updateUserInfo({ userId: newId });
      setIsValidId(validateId(newId));
      setButtonText("중복확인");
      setIsIdChecked(false);
    },
    [updateUserInfo]
  );

  const handleIdCheck = async () => {
    if (!userInfo.userId) return;
    if (!isValidId) {
      setButtonText("형식 오류");
      return;
    }
    const result = await refetch();
    if (result.data?.available) {
      setButtonText("사용가능");
    } else {
      setButtonText("중복됨");
    }
    setIsIdChecked(true);
  };

  const handleDateChange = (date: SelectedDate) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      updateUserInfo({ birthDate: `${year}-${month}-${day}` });
    }
  };

  const handleNext = () => {
    if (!userInfo.userName?.trim()) return showError("이름을 입력해주세요.");
    if (!userInfo.userId) return showError("ID를 입력해주세요.");
    if (!isIdChecked || !idCheckData?.available)
      return showError("ID 중복확인이 필요합니다.");
    if (!userInfo.birthDate) return showError("생년월일을 선택해주세요.");
    onNext();
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setIsPokePopupVisible(true);
    setTimeout(() => setIsPokePopupVisible(false), 1500);
  };

  return (
    <div className={s.profileSetUpContainer}>
      <div className={s.showCharacter}>
        <button className={s.previousBtn} onClick={onPrev}>
          이전
        </button>
        <p className={s.pHeader}>캐릭터 설정하기</p>
        <button className={s.nextBtn} onClick={handleNext}>
          다음
        </button>
        <p className={s.pDescription}>내 캐릭터에 이름과 나이를 지어주세요!</p>
        <div className={s.characterContainer}>
          <img
            className={s.characterSkin}
            src={`${IMG_BASE_URL}${userInfo.face.skinColor}`}
            alt="skin"
          />
          <img
            className={s.characterEyes}
            src={`${IMG_BASE_URL}${userInfo.face.eyes}`}
            alt="eyes"
          />
          <img
            className={s.characterNose}
            src={`${IMG_BASE_URL}${userInfo.face.nose}`}
            alt="nose"
          />
          <img
            className={s.characterMouth}
            src={`${IMG_BASE_URL}${userInfo.face.mouth}`}
            alt="mouth"
          />
          {userInfo.face.mole && (
            <img
              className={s.characterMole}
              src={`${IMG_BASE_URL}${userInfo.face.mole}`}
              alt="mole"
            />
          )}

          <img
            className={s.characterHair}
            src={`${IMG_BASE_URL}${userInfo.face.hair}`}
            alt="hair"
          />

          {!isWearingSet && (
            <>
              <img
                className={s.characterTop}
                src={`${IMG_BASE_URL}${userInfo.outfit.top}`}
                alt="top"
              />
              <img
                className={s.characterBottom}
                src={`${IMG_BASE_URL}${userInfo.outfit.bottom}`}
                alt="bottom"
              />
            </>
          )}
          {isWearingSet && (
            <img
              className={s.characterSet}
              src={`${IMG_BASE_URL}${userInfo.outfit.set}`}
              alt="set"
            />
          )}

          <img
            className={s.characterShoes}
            src={`${IMG_BASE_URL}${userInfo.outfit.shoes}`}
            alt="shoes"
          />

          {Object.entries(userInfo.item).map(([part, src]) => {
            if (!src) return null;
            return (
              <img
                key={part}
                className={s[part]}
                src={`${IMG_BASE_URL}${src}`}
                alt={part}
              />
            );
          })}
        </div>
        <img
          className={s.characterBackground}
          src={characterBackground}
          alt="후광"
        />
      </div>

      <div className={s.inputContainer}>
        <input
          type="text"
          value={userInfo.userName || ""}
          onChange={handleNameChange}
          placeholder="15자 이하로 입력"
          className={s.nameInput}
        />
        <div className={s.IdContainer}>
          <div className={s.id}>ID</div>
          <input
            type="text"
            value={userInfo.userId || ""}
            onChange={handleIdChange}
            placeholder="영문, 숫자 조합 4-10자리"
            className={s.idInput}
          />
          {isIdChecked && (
            <div
              className={`${s.idCheckMessage} ${
                idCheckData?.available ? s.available : s.unavailable
              }`}
            >
              {idCheckData?.message || "확인 실패"}
            </div>
          )}
          <button
            onClick={handleIdCheck}
            className={`${s.checkBtn} ${
              idCheckData?.available ? s.available : ""
            }`}
            disabled={!isValidId || isFetching}
          >
            {isFetching ? "확인중..." : buttonText}
          </button>
        </div>

        <div className={s.ageContainer}>
          <div className={s.age}>생년월일</div>
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              handleDateChange(date as Date);
            }}
            value={selectedDate}
            formatDay={(_, date) => date.getDate().toString()}
          />
        </div>
      </div>

      {isPokePopupVisible && <div className={s.pokePopup}>{errorMessage}</div>}
    </div>
  );
};

export default ProfileSetUp;