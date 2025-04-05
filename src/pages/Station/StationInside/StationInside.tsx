import { useState, useEffect } from "react";
import { axiosRequest } from "../../../functions/axiosRequest";
import { useCharacterStore } from "../../../store/useCharacterStore";
import { useNavigate } from "react-router-dom";
import s from "./StationInside.module.scss";
import backBtn from "../../../assets/btnImg/whiteBackBtn.png";
import customBtn from "../../../assets/btnImg/customBtn.png";
import settingBtn from "../../../assets/btnImg/settingBtn.png";
import messageBtn from "../../../assets/btnImg/messageBtn.svg";
import StationSlide from "../StationSlide/StationSlide";
import StationReport from "./StationReport/StationReport";
import MyReport from "./CharacterReport/MyReport";
import CharacterReport from "./CharacterReport/CharacterReport";
import Pending from "../../PageManagement/Pending";

const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

interface StationMember {
  userId: string;
  userName: string;
  character: string;
  profile: string;
  positionX: number;
  positionY: number;
  todayReport: boolean;
  isFriend: boolean;
}

interface StationResponse {
  stationId: string;
  adminUserId: string;
  name: string;
  intro: string;
  numOfUsers: number;
  stationBackground: string;
  reportNoticeTime: string;
  reportWritten: boolean;
  stationMembers: StationMember[];
}

const StationInside: React.FC = () => {
  const navigate = useNavigate();
  const [stationData, setStationData] = useState<StationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showSlide, setShowSlide] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StationMember | null>(
    null
  );
  const { userInfo } = useCharacterStore();

  const handleSettingClick = () => {
    setShowSlide(true);
	};
	
	const handleCustomClick = () => {
    navigate("/station/stationbackgroundsetting");
  };

  // 스테이션 데이터를 새로고침하는 함수
  const refreshStationData = async () => {
    if (!stationId) return;
    try {
      const response = await axiosRequest<StationResponse>(
        `/stations/${stationId}`,
        "GET",
        null
      );
      if (response) {
        setStationData(response.data);
      }
    } catch (err) {
      setError(err as Error);
    }
  };

  const currentUserId = userInfo.userId;

  // 멤버 클릭 핸들러 추가
  const handleMemberClick = (member: StationMember) => {
    setSelectedMember(member);
  };

  const stationId = sessionStorage.getItem("stationId") as string;
  const handleLeaveStation = () => {
    sessionStorage.removeItem("stationId");
    navigate("/station");
  };

  useEffect(() => {
    if (!stationId) {
      navigate("/station");
      return;
    }
  }, [stationId, navigate]);

  useEffect(() => {
    const getStationData = async () => {
      if (!stationId) return;

      try {
        setIsLoading(true);
        const response = await axiosRequest<StationResponse>(
          `/stations/${stationId}`,
          "GET",
          null
        );
        if (response) {
          setStationData(response.data);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    getStationData();
  }, [stationId]);

  if (isLoading) return <Pending/>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!stationData) return null;

  return (
    <div
      className={s.container}
      style={{
        backgroundImage: `url(${IMG_BASE_URL}${stationData.stationBackground}.png)`,
      }}
    >
      {!stationData.reportWritten && (
        <StationReport
          stationId={stationId}
          onReportSubmitted={refreshStationData}
        />
      )}
      <div className={s.headerContainer}>
        <div className={s.backBtn}>
          <img src={backBtn} alt="뒤로가기" onClick={handleLeaveStation} />
        </div>
        <div className={s.header}>
          <h2>[ {stationData.name} ]</h2>
          <p>{stationData.intro}</p>
        </div>
        <div className={s.btnGroup}>
          <div className={s.customBtn} onClick={handleCustomClick}>
            <img src={customBtn} alt="" />
          </div>
          <div className={s.settingBtn} onClick={handleSettingClick}>
            <img src={settingBtn} alt="" />
          </div>
        </div>
      </div>
      <div className={s.content}>
        <div className={s.memberList}>
          {stationData.stationMembers.map((member) => (
            <div
              key={member.userId}
              className={s.memberItem}
              style={{
                position: "fixed",
                left: `${member.positionX}dvw`,
                top: `${member.positionY}dvh`,
                width: "30dvw",
              }}
            >
              <img
                src={member.character}
                alt=""
                style={{
                  position: "fixed",
                  left: `${member.positionX}dvw`,
                  top: `${member.positionY}dvh`,
                  width: "30dvw",
                }}
              />
              {member.todayReport && (
                <div
                  className={s.messageIcon}
                  style={{
                    position: "fixed",
                    left: `${member.positionX}dvw`,
                    top: `${member.positionY}dvh`,
                    zIndex: 100,
                  }}
                >
                  <img
                    src={messageBtn}
                    alt="리포트"
                    style={{
                      position: "fixed",
                      left: `${member.positionX + 20}dvw`,
                      top: `${member.positionY + 2}dvh`,
                      zIndex: 100,
                      height: "7dvw",
                    }}
                    onClick={() => handleMemberClick(member)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {showSlide && (
        <StationSlide
          stationData={stationData}
          onClose={() => setShowSlide(false)}
        />
      )}
      {selectedMember &&
        (selectedMember.userId === currentUserId ? (
          <MyReport
            onClose={() => setSelectedMember(null)}
            stationId={stationId}
            userId={selectedMember.userId}
          />
        ) : (
          <CharacterReport
            memberName={selectedMember.userName}
            onClose={() => setSelectedMember(null)}
            stationId={stationId}
						userId={selectedMember.userId}
						profile={selectedMember.profile}
          />
        ))}
    </div>
  );
};

export default StationInside;
