import React, { useEffect, useMemo, useState } from 'react';
import s from './ShowStationList.module.scss';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../../../store/useCharacterStore';
import { Stations } from '../../../interfaces/Interfaces';
import SortCriteriaBox from '../../../components/SortCriteriaBox/SortCriteriaBox';
import StationDisplay from './StationDisplay/StationDisplay';
import SearchStationModal from '../../../components/SearchStationModal/SearchStationModal';

// 이미지 파일
import searchIcon from '../../../assets/StationList/searchIcon.svg';
import createIcon from '../../../assets/StationList/createIcon.svg';
import noStationLogo from '../../../assets/StationList/noStationLogo.png';
import { fetchRequest } from '../../../functions/fetchRequest';
// import background1 from '../../../assets/stationBackgroundImg/stationBackgroundImg_01.png';
// import background2 from '../../../assets/stationBackgroundImg/stationBackgroundImg_02.png';
// import background3 from '../../../assets/stationBackgroundImg/stationBackgroundImg_03.png';
// import background4 from '../../../assets/stationBackgroundImg/stationBackgroundImg_04.png';

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;
// 정거장 배경 이미지 매핑
// const stationBackgrounds: { [key: string]: string } = {
//   stationBackgroundImg_01: background1,
//   stationBackgroundImg_02: background2,
//   stationBackgroundImg_03: background3,
//   stationBackgroundImg_04: background4,
// };
const stationBackgrounds: { [key: string]: string } = {
  station_01: `${IMG_BASE_URL}station_01.png`,
  station_02: `${IMG_BASE_URL}station_02.png`,
  station_03: `${IMG_BASE_URL}station_03.png`,
  station_04: `${IMG_BASE_URL}station_04.png`,
};
const ShowStationList: React.FC = () => {
  const { userInfo } = useCharacterStore();
  const userName = userInfo.userName || "플레이아데스";
  const [stations, setStations] = useState<Stations>({ stations: [] });
  const [sortCriteria, setSortCriteria] = useState<"최신순" | "이름순">("최신순");
  const [isSearchStationModalVisible, setIsSearchStationModalVisible] = useState(false);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isNoExistStationPopupVisible, setIsNoExistStationPopupVisible] = useState(false);

  // 정거장 목록 가져오기
  const fetchStations = async () => {
    try {
      const response = await fetchRequest<Stations>('/stations', 'GET', null);
      console.log('정거장 불러오기 요청 보냄. 응답: ',response);
      if (response && Array.isArray(response.stations)) {
        setStations(response);
        console.log('정거장 불러오기 응답 잘 받음');
      }
    } catch (error) {
      console.error('정거장 불러오기 실패:', error);
    }
  };

  // 정거장 없음 팝업 표시 (1.5초 후 자동 닫힘)
  const handlePopupNoExistStation = () => {
    setIsNoExistStationPopupVisible(true);
    setTimeout(() => {
      setIsNoExistStationPopupVisible(false);
    }, 1500);
  };

  // 정거장 검색 및 입장
  const fetchSearchedStation = async (stationId: string) => {
    try {
      const response = await fetchRequest<{ message: string }>(`/stations/${stationId}`, 'PATCH', null);
      console.log('정거장 검색어:', stationId);
  
      // 200 OK - 정거장 입장 성공
      if (response?.message === "Enter Station Success") {
        console.log("정거장 입장 성공:", response);
        console.log('정거장 입장 성공!');
        //navigate(`/station/${stationId}`);
        return;
      }
  
      // 401 Unauthorized - 로그인 필요
      if (response?.message === "Invalid or expired token") {
        console.log('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
  
      // 404 Not Found - 정거장이 존재하지 않음
      if (response?.message === "Station not found") {
        console.warn("정거장 없음:", response.message);
        handlePopupNoExistStation();
        return;
      }
  
      // 409 Conflict - 정거장 인원이 가득 찼거나 이미 가입된 경우
      if (response?.message.includes("Station Full")) {
        console.log('정거장 인원이 가득 찼습니다.');
        return;
      }
  
      if (response?.message.includes("User already in the station")) {
        console.log('이미 정거장에 가입되어 있습니다.');
        //navigate(`/station/${stationId}`);
        return;
      }
  
      // 예상하지 못한 메시지 처리
      console.warn("예상치 못한 응답:", response?.message);
      console.log('정거장 입장 중 예상치 못한 오류가 발생했습니다.');
  
    } catch (error: unknown) {
      console.error('정거장 검색 오류:', error);
  
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message: string } } };
        const { status, data } = axiosError.response || {};
  
        if (data) {
          console.warn(`서버 응답 (${status}):`, data.message);
        }
  
        switch (status) {
          case 401:
            console.log('로그인이 필요합니다.');
            navigate('/login');
            break;
          case 404:
            handlePopupNoExistStation();
            break;
          case 409:
            if (data?.message?.includes('Station Full')) {
              console.log('정거장 인원이 가득 찼습니다.');
            } else if (data?.message?.includes('User already in the station')) {
              console.log('이미 정거장에 가입되어 있습니다.');
              navigate(`/station/${stationId}`);
            }
            break;
          default:
            console.log('정거장 입장 중 오류가 발생했습니다.');
        }
      } else {
        console.log('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
      }
    }
  };

  // 검색 모달 닫기
  const closeSearchStationModal = () => {
    setIsSearchStationModalVisible(false);
    setSearchValue('');
  };

  // 검색 실행
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchValue.trim() !== '') {
      await fetchSearchedStation(searchValue);
    }
  };

  // 정거장 입장
  const handleEnterStation = async (stationId: string) => {
    await fetchSearchedStation(stationId);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const sortedByRecent = useMemo(() => [...stations.stations], [stations]);

  const sortedByName = useMemo(() => {
    return [...stations.stations].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [stations]);

  const sortedStations = sortCriteria === "최신순" ? sortedByRecent : sortedByName;

  return (
    <div className={s.container}>
      <div className={s.headContainer}>
        <div className={s.title}>
          <div className={s.titleText}>{userName}님 어디로 떠나볼까요?</div>
          <div className={s.titleButtons}>
            <button className={s.searchStationButton} onClick={() => setIsSearchStationModalVisible(true)}>
              <img src={searchIcon} alt="searchIcon" />
            </button>
            <button className={s.createStationButton} onClick={() => navigate("/station/createstation", { replace: true })}>
              <img src={createIcon} alt="createIcon" />
            </button>
          </div>
        </div>
      </div>

      <div className={s.separator}>
        <div className={s.totalNumOfStations}>전체 {sortedStations.length || 0}</div>
        <div className={s.sortCriteriaBoxContainer}>
          <SortCriteriaBox sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} textColor="#E1E1E1" />
        </div>
      </div>

      <div className={s.stationListWrapper}>
        <div className={s.stationListContainer}>
          {sortedStations.length > 0 ? (
            sortedStations.map((station) => (
              <div key={station.stationId} className={s.stationDisplayWrapper} onClick={() => handleEnterStation(station.stationId)}>
                <StationDisplay
                  name={station.name}
                  numOfUsers={station.numOfUsers}
                  background={stationBackgrounds[station.stationBackground] || `${IMG_BASE_URL}station_01.png`}
                />
              </div>
            ))
          ) : (
            <div className={s.noStation}>
              <span className={s.noStationTitle}>아직 등록된 정거장이 없어요...</span>
              <span className={s.noStationText}>정거장을 검색하거나, 새로운 정거장을 만들어 보세요!</span>
              <img className={s.noStationLogo} src={noStationLogo} alt="noStationLogo" />
            </div>
          )}
        </div>
      </div>

      {/* 검색한 정거장이 없을 때 나타나는 팝업 */}
      {isNoExistStationPopupVisible && 
        <div className={s.popupNoExistStation}>
          <span className={s.popupTitle}>검색한 정거장이 존재하지 않아요!</span>
          <span className={s.popupText}>코드를 다시 확인해주세요</span>
        </div>
      }

      {isSearchStationModalVisible &&
        <SearchStationModal name={userName} handleSubmit={handleSubmit} searchValue={searchValue} setSearchValue={setSearchValue} handleCloseModal={closeSearchStationModal}/>
      }
    </div>
  );
};

export default ShowStationList;