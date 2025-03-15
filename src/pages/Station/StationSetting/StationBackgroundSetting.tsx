import React, { useState } from "react";
import s from "./CreateStation.module.scss";
import { useNavigate } from "react-router-dom";
import { fetchRequest } from "../../../functions/fetchRequest";

import SetStationBackground from "./SetStationBackground/SetStationBackground";

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

const stationBackgrounds = [
  `${IMG_BASE_URL}station_dim_01.png`,
  `${IMG_BASE_URL}station_dim_02.png`,
  `${IMG_BASE_URL}station_dim_03.png`,
  `${IMG_BASE_URL}station_dim_04.png`,
];
const stationBackgroundPrevs = [
  `${IMG_BASE_URL}stationBackgroundPrevImg_01.png`,
  `${IMG_BASE_URL}stationBackgroundPrevImg_02.png`,
  `${IMG_BASE_URL}stationBackgroundPrevImg_03.png`,
  `${IMG_BASE_URL}stationBackgroundPrevImg_04.png`,
];

const StationBackgroundSetting: React.FC = () => {
  const navigate = useNavigate();

  const [background, setBackground] = useState(
    `${IMG_BASE_URL}station_dim_01.png`
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleBackgroundComplete = async () => {
    // 이미지 파일명 추출 함수
    const getFileName = (path: string) => {
      const fileName = path.split("/").pop(); // 경로에서 파일명 추출
      if (!fileName) return "station_dim_01";
      const match = fileName.match(/station_dim_\d+/);
      return match ? match[0] : "station_dim_01";
    };

    const stationId = sessionStorage.getItem("stationId");
    if (!stationId) {
      console.error("stationId not found in sessionStorage");
      return;
    }

    const backgroundName = getFileName(background);
    console.log("backgroundName: ", backgroundName);

    try {
      // 서버에 배경 데이터 전송
      const response = await fetchRequest<{
        message?: string;
      }>(`/stations/${stationId}/background`, "PATCH", {
        stationBackground: backgroundName,
      });

      if (response) {
        console.log("배경 설정 성공:", response);
        navigate(-1);
      } else {
        console.log("배경 설정 실패. 응답: ", response);
      }
    } catch (error: unknown) {
      console.error("배경 설정 중 오류:", error);

      if (error instanceof Error) {
        console.log(`배경 설정 중 오류 발생: ${error.message}`);
      } else {
        console.log("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={s.container}>
      <SetStationBackground
        backgrounds={stationBackgrounds}
        backgroundPrevs={stationBackgroundPrevs}
        background={background}
        setBackground={setBackground}
        handleBack={handleBack}
        handleComplete={handleBackgroundComplete}
      />
    </div>
  );
};

export default StationBackgroundSetting;
