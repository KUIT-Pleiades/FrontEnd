/* CreateStationInfo.tsx
   1단계: 정거장 정보(이름, 소개, 알림 시간) 입력 화면
   - props로 상위에서 전달받은 상태와 setter 함수를 이용해 값을 업데이트
   - "다음" 버튼 클릭 시 handleNext를 호출
*/
import React from 'react';
import s from './SetStationInfo.module.scss';
import backBtn from "../../../../assets/btnImg/backBtn.png"

// 이미지 파일 (슬래시)
import slash from '../../../../assets/StationCreate/slash.svg';

interface SetStationInfoProps {
	stationName: string;
	setStationName: React.Dispatch<React.SetStateAction<string>>;
	stationIntro: string;
	setStationIntro: React.Dispatch<React.SetStateAction<string>>;
	ampm: '오전' | '오후';
	setAmpm: React.Dispatch<React.SetStateAction<'오전' | '오후'>>;
	hour: string;
	setHour: React.Dispatch<React.SetStateAction<string>>;
	minute: string;
	setMinute: React.Dispatch<React.SetStateAction<string>>;
	showPopup: boolean;
	handleCancel: () => void;
	handleNext: () => void;
}

const SetStationInfo: React.FC<SetStationInfoProps> = ({
	stationName,
	setStationName,
	stationIntro,
	setStationIntro,
	ampm,
	setAmpm,
	hour,
	setHour,
	minute,
	setMinute,
	showPopup,
	handleCancel,
	handleNext,
}) => {
	return (
    <div className={s.container}>
      {/* 헤더 부분 */}
      <div className={s.header}>
        <span className={s.headerTitle}>정거장 설정</span>
        <div className={s.headerContents}>
          <button className={s.headerCancelButton} onClick={handleCancel}>
            <img src={backBtn} alt="" />
          </button>
          <button
            className={s.headerNextButton}
            onClick={handleNext}
            disabled={showPopup}
          >
            확인
          </button>
        </div>
      </div>

      {/* 실제 입력 영역 */}
      <div className={s.body}>
        {/* 우주정거장 이름 입력 */}
        <div className={s.name}>
          <span className={s.nameTitle}>우주정거장 이름</span>
          <div className={s.nameInputSection}>
            <input
              className={s.nameInput}
              type="text"
              placeholder="정거장 이름을 입력해주세요."
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
            />
          </div>
        </div>

        {/* 우주정거장 한줄소개 입력 */}
        <div className={s.intro}>
          <span className={s.introTitle}>우주정거장 한줄소개</span>
          <div className={s.introInputSection}>
            <input
              className={s.introInput}
              type="text"
              placeholder="정거장을 한 줄로 소개해주세요."
              value={stationIntro}
              onChange={(e) => setStationIntro(e.target.value)}
            />
          </div>
        </div>

        {/* 리포트 업데이트 알림 입력 (오전/오후, 시간, 분) */}
        <div className={s.alarm}>
          <span className={s.alarmTitle}>리포트 업데이트 알림</span>
          <div className={s.alarmRow}>
            <select
              className={s.alarmSelect}
              value={ampm}
              onChange={(e) => setAmpm(e.target.value as "오전" | "오후")}
            >
              <option className={s.alarmSelectOption} value="오전">
                오전
              </option>
              <option className={s.alarmSelectOption} value="오후">
                오후
              </option>
            </select>
            <img src={slash} alt="slash" />
            <select
              className={s.alarmSelect}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option
                  key={num}
                  value={String(num)}
                  className={s.alarmSelectOption}
                >
                  {num}
                </option>
              ))}
            </select>
            <span className={s.hourText}>시</span>
            <img src={slash} alt="slash" />
            <select
              className={s.alarmSelect}
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => i).map((num) => {
                const val = num < 10 ? `0${num}` : String(num);
                return (
                  <option key={val} value={val} className={s.alarmSelectOption}>
                    {val}
                  </option>
                );
              })}
            </select>
            <span className={s.minText}>분</span>
          </div>
        </div>
      </div>

      {/* 미완성 팝업 */}
      {showPopup && (
        <div className={s.incompletePopup}>
          <span className={s.incompletePopupTitle}>
            정거장 설정을 완료해주세요!
          </span>
        </div>
      )}
    </div>
  );
};

export default SetStationInfo;

