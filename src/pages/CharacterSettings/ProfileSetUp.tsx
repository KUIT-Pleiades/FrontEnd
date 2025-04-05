import Calendar from "react-calendar";
import s from "./profileSetUp.module.scss";
import characterBackground from "../../assets/backgroundImg/characterBackground.png";
import React, { useState, useCallback } from "react";
import { useCharacterStore } from "../../store/useCharacterStore";
//import popupStars from "../../assets/popupStars.svg";
import { axiosRequest } from "../../functions/axiosRequest";

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

interface ProfileSetUpProps {
  onNext: () => void;
  onPrev: () => void;
}

interface IdCheckResponse {
  available: boolean;
  message: string;
}

const ProfileSetUp = ({ onNext, onPrev }: ProfileSetUpProps) => {
  const { userInfo, updateUserInfo } = useCharacterStore();
  const [isValidId, setIsValidId] = useState<boolean>(false);
  const [idExists, setIdExists] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("중복확인");
  const [idCheckMessage, setIdCheckMessage] = useState<string>("");
  const [isIdChecked, setIsIdChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPokePopupVisible, setIsPokePopupVisible] = useState(false);

  type DatePiece = Date | null;
  type SelectedDate = DatePiece | [DatePiece, DatePiece];

  const defaultDate = new Date("2000-01-01"); // 원하는 날짜 지정
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(defaultDate);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value.trim();
      if (newName.length <= 15) {
        updateUserInfo({ userName: newName });
      }
    },
    [updateUserInfo]
  );

  // ID 유효성 검사 함수
  const validateId = (id: string): boolean => {
    // 영문, 숫자 조합 4-10자리 검사
    const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,10}$/;
    return idRegex.test(id);
  };

  const checkDuplicateId = async (id: string) => {
    try {
      const response = await axiosRequest<IdCheckResponse>(
        `/auth/checkId?userId=${id}`,
        "GET",
        null
      );

      if (response === null) {
        setIdCheckMessage("서버 연결에 실패했습니다.");
        return false;
      }

      // 응답 메시지 사용
      setIdCheckMessage(response.data.message);
      return response.data.available;
    } catch (error) {
      console.error("ID 중복확인 오류:", error);
      setIdCheckMessage("중복확인 중 오류가 발생했습니다.");
      return false;
    }
  };

  const handleIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newId = e.target.value;
      updateUserInfo({ userId: newId });
      setIsValidId(validateId(newId));
      setIdExists(false);
      setButtonText("중복확인");
    },
    [updateUserInfo]
  );

  const memoizedIdCheck = useCallback(async () => {
    if (!userInfo.userId) {
      setIdCheckMessage("ID를 입력해주세요.");
      return;
    }

    if (!isValidId) {
      setIdCheckMessage("올바른 ID 형식이 아닙니다.");
      return;
    }

    const isAvailable = await checkDuplicateId(userInfo.userId);

    setIdExists(isAvailable);
    setButtonText(isAvailable ? "사용가능" : "중복확인");
    setIsIdChecked(true);
  }, [userInfo.userId, isValidId]);

  const handleDateChange = (date: SelectedDate) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      updateUserInfo({ birthDate: formattedDate });
    }
  };

  const handleNext = () => {
    if (!userInfo.userName?.trim()) {
      setErrorMessage("이름을 입력해주세요.");
      showErrorPopup();
      return;
    }
    if (!userInfo.userId) {
      setErrorMessage("ID를 입력해주세요.");
      showErrorPopup();
      return;
    }
    if (!idExists) {
      setErrorMessage("ID 중복확인이 필요합니다.");
      showErrorPopup();
      return;
    }
    if (!userInfo.birthDate) {
      setErrorMessage("생년월일을 선택해주세요.");
      showErrorPopup();
      return;
    }
    onNext();
  };

  const showErrorPopup = () => {
    setIsPokePopupVisible(true);
    setTimeout(() => {
      setIsPokePopupVisible(false);
    }, 1500);
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
                idExists ? s.available : s.unavailable
              }`}
            >
              {idCheckMessage}
            </div>
          )}
          <button
            onClick={memoizedIdCheck}
            className={`${s.checkBtn} ${idExists ? s.available : ""}`}
            disabled={!isValidId}
          >
            {buttonText}
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
      {isPokePopupVisible && (
        <div className={s.pokePopup}>
          {`${errorMessage}`}
        </div>
      )}
    </div>
  );
};

export default ProfileSetUp;
