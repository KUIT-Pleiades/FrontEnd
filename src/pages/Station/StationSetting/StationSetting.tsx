import React, { useState, useEffect } from "react";
import s from "./CreateStation.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchRequest } from "../../../functions/fetchRequest";

// 하위 스텝 컴포넌트
import SetStationInfo from "./SetStationInfo/SetStationInfo";

interface StationResquest {
  name?: string;
  intro?: string;
  reportNoticeTime?: string;
}

interface LocationState {
  stationId: string;
  name: string;
  intro: string;
  reportNoticeTime: string;
}

const StationSetting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stationData = location.state as LocationState;

  // 정거장 정보 (이름, 소개, 시간) 상태
  const [stationName, setStationName] = useState(stationData?.name || "");
  const [stationIntro, setStationIntro] = useState(stationData?.intro || "");
  const [ampm, setAmpm] = useState<"오전" | "오후">("오전");
  const [hour, setHour] = useState("9");
  const [minute, setMinute] = useState("00");

  // 시간 데이터 초기화
  useEffect(() => {
    if (stationData?.reportNoticeTime) {
      const time = new Date(`2000-01-01 ${stationData.reportNoticeTime}`);
      const hours = time.getHours();

      setAmpm(hours >= 12 ? "오후" : "오전");
      setHour(String(hours % 12 || 12));
      setMinute(String(time.getMinutes()).padStart(2, "0"));
    }
  }, [stationData]);

  // "입력값 미완성" 팝업 표시 상태
  const [showPopup, setShowPopup] = useState(false);

  // 취소 버튼 클릭 시 동작
  const handleCancel = () => {
    navigate(-1);
  };

  const handleInfoNext = () => {
    // 입력값 검증
    if (!stationName.trim() || !stationIntro.trim() || !hour || !minute) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500);
      return;
    }
    handleComplete();
  };

  const handleComplete = async () => {
    // 시간 변환 (오전/오후 → 24시간)
    const numericHour = Number(hour);
    let convertedHour = numericHour;

    if (ampm === "오후" && numericHour !== 12) {
      convertedHour = numericHour + 12;
    }
    if (ampm === "오전" && numericHour === 12) {
      convertedHour = 0;
    }
    const finalHour = convertedHour.toString().padStart(2, "0");
    const finalMinute = minute.padStart(2, "0");
    const reportNoticeTime = `${finalHour}:${finalMinute}:00`;

    try {
      // 서버에 최종 데이터 전송
      const response = await fetchRequest<StationResquest>(
        `/stations/${stationData.stationId}/settings`,
        "PATCH",
        {
          name: stationName,
          intro: stationIntro,
          reportNoticeTime: reportNoticeTime,
        }
      );

      if (response) {
        console.log("정거장 설정 업데이트 성공:", response);
        navigate("/station/stationinside");
      } else {
        console.log("정거장 설정 업데이트 실패. 응답: ", response);
      }
    } catch (error: unknown) {
      console.error("정거장 설정 업데이트 중 오류:", error);

      if (error instanceof Error) {
        console.log(`정거장 설정 업데이트 중 오류 발생: ${error.message}`);
      } else {
        console.log("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={s.container}>
      <SetStationInfo
        stationName={stationName}
        setStationName={setStationName}
        stationIntro={stationIntro}
        setStationIntro={setStationIntro}
        ampm={ampm}
        setAmpm={setAmpm}
        hour={hour}
        setHour={setHour}
        minute={minute}
        setMinute={setMinute}
        showPopup={showPopup}
        handleCancel={handleCancel}
        handleNext={handleInfoNext}
      />
    </div>
  );
};

export default StationSetting;
