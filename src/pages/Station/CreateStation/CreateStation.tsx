import React, { useState } from 'react';
import s from './CreateStation.module.scss';
import { useNavigate } from 'react-router-dom';
import { axiosRequest } from '../../../functions/axiosRequest';

// 하위 스텝 컴포넌트
import CreateStationInfo from './CreateStationInfo/CreateStationInfo';
import CreateStationBackground from './CreateStationBackground/CreateStationBackground';

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

const stationBackgrounds = [
  `${IMG_BASE_URL}station_dim_01.png`,
  `${IMG_BASE_URL}station_dim_02.png`,
  `${IMG_BASE_URL}station_dim_03.png`,
  `${IMG_BASE_URL}station_dim_04.png`
];

const stationBackgroundPrevs = [
  `${IMG_BASE_URL}stationBackgroundPrevImg_01.png`,
  `${IMG_BASE_URL}stationBackgroundPrevImg_02.png`,
  `${IMG_BASE_URL}stationBackgroundPrevImg_03.png`,
  `${IMG_BASE_URL}stationBackgroundPrevImg_04.png`
]

const CreateStation: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // 정거장 정보 (이름, 소개, 시간) 상태
  const [stationName, setStationName] = useState('');
  const [stationIntro, setStationIntro] = useState('');
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오전');
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('00');

  // 배경 선택 상태
  const [background, setBackground] = useState(`${IMG_BASE_URL}station_dim_01.png`);

  // “입력값 미완성” 팝업 표시 상태
  const [showPopup, setShowPopup] = useState(false);

  // 취소 버튼 클릭 시 동작
  const handleCancel = () => {
    navigate('/station');
  };

  const handleBack = () => {
    setStep(1);
  };

  // 1단계(정보 입력)에서 "다음" 버튼 누르면
  const handleInfoNext = () => {
    // 입력값 검증
    if (!stationName.trim() || !stationIntro.trim() || !hour || !minute) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500);
      return;
    }
    // 검증 통과 시 2단계(배경 선택)로 이동
    setStep(2);
  };

  // 2단계(배경 선택)에서 "완료" 버튼 누르면 서버 전송
  const handleBackgroundComplete = async () => {
    // 시간 변환 (오전/오후 → 24시간)
    const numericHour = Number(hour);
    let convertedHour = numericHour;

    if (ampm === '오후' && numericHour !== 12) {
      convertedHour = numericHour + 12;
    }
    if (ampm === '오전' && numericHour === 12) {
      convertedHour = 0;
    }
    const finalHour = convertedHour.toString().padStart(2, '0');
    const finalMinute = minute.padStart(2, '0');
    const reportNoticeTime = `${finalHour}:${finalMinute}:00`;

    // 이미지 파일명 추출 함수
    const getFileName = (path: string) => {
      const fileName = path.split('/').pop(); // 경로에서 파일명 추출
      if (!fileName) return 'station_dim_01';
      const match = fileName.match(/station_dim_\d+/);
      return match ? match[0] : 'station_dim_01';
    };
    
    const backgroundName = getFileName(background);
    console.log('backgroundName:',backgroundName);

    try {
      // 서버에 최종 데이터 전송
      const response = await axiosRequest<{
        stationId?: string;
        message?: string;
      }>("/stations", "POST", {
        stationBackground: backgroundName,
        name: stationName,
        intro: stationIntro,
        reportNoticeTime: reportNoticeTime,
      });
      console.log('정거장 생성 요청 보내는 중. 요청 바디: ');
      console.log('stationBackground: ', backgroundName);
      console.log('name: ', stationName);
      console.log('intro: ', stationIntro);
      console.log('reportNoticeTime: ', reportNoticeTime);

      if (response && response.data.stationId) {
        console.log('정거장 생성 성공:', response);
        sessionStorage.setItem('stationId', response.data.stationId);
        navigate('/station/stationinside');
      } else {
        console.log('정거장 생성 실패. 응답: ', response);
        if (response?.message === 'Invalid or expired token') {
          console.log('토큰이 만료되었거나 유효하지 않습니다. 로그인 페이지로 이동합니다. 주석 해제 필요');
          //navigate('/login');
        }
      }
    } catch (error: unknown) {
      console.error('정거장 생성 중 오류:', error);

      if (error instanceof Error) {
        console.log(`정거장 생성 중 오류 발생: ${error.message}`);
      } else {
        console.log('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={s.container}>
      {/* 1단계: 정거장 정보 입력 */}
      {step === 1 && (
        <CreateStationInfo
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
      )}

      {/* 2단계: 배경 선택 */}
      {step === 2 && (
        <CreateStationBackground
          backgrounds={stationBackgrounds}
          backgroundPrevs={stationBackgroundPrevs}
          background={background}
          setBackground={setBackground}
          handleBack={handleBack}
          handleComplete={handleBackgroundComplete}
        />
      )}
    </div>
  );
};

export default CreateStation;

