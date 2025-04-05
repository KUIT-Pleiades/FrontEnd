import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './FriendsTab.module.scss';
import { useCharacterStore } from '../../store/useCharacterStore';

// components
import ShowTotalFriendsList from './ShowTotalFriendsList/ShowTotalFriendsList';
import SearchUsersBar from '../../components/SearchUsersBar/SearchUsersBar';
import { axiosRequest } from '../../functions/axiosRequest';
import SendSignalPopup from './SendSignalPopup/SendSignalPopup';
import ReceiveSignalPopup from './ReceiveSignalPopup/ReceiveSignalPopup';

// image files
import pleiadesLogo from '../../assets/FriendsTab/pleiadesLogoNoFriends.png';
import backArrow from '../../assets/FriendsTab/backArrow.svg';
import Pending from '../PageManagement/Pending';
import { SignalFrom, Social } from '../../interfaces/Interfaces';

const FriendsTab: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const { userInfo } = useCharacterStore();
    const userName = userInfo.userName || "플레이아데스";
    const [friendsData, setFriendsData] = useState<Social>({ received: [], friend: [], sent: [] });
    const [hasNoFriend, setHasNoFriend] = useState<boolean>(false);

    const [signalTo, setSignalTo] = useState<string>("");
    const [signalImageIndex, setSignalImageIndex] = useState<number>(0);
    const [isSendSignalPopupVisible, setIsSendSignalPopupVisible] = useState<boolean>(false);
    const handleOpenSendSignalPopup = (friendName: string) => {
        setSignalTo(friendName);
        setIsSendSignalPopupVisible(true);
    };
    const handleCloseSendSignalPopup = () => {
        setIsSendSignalPopupVisible(false);
        setSignalTo("");
    };

    const [signalsQueue, setSignalsQueue] = useState<SignalFrom[]>([]);
    const [currentSignalIndex, setCurrentSignalIndex] = useState<number>(0);
    const [isReceiveSignalPopupVisible, setIsReceiveSignalPopupVisible] = useState<boolean>(false);

    // friends interaction functions
    const handleDeleteFriend = async(friendId: string) => {
        const response = await axiosRequest<{ message: string }>(
          `/friends/requests/${friendId}`,
          "DELETE",
          null
        );
        if (response) {
            console.log("친구 삭제 완료. 응답: ", response);
            getFriendsList(); // 친구 목록 갱신
        } else console.error("친구 삭제 실패");
    }
    const handleAcceptRequest = async (friendId: string) => {
        const response = await axiosRequest<{ message: string }>(
          `/friends/requests/${friendId}`,
          "PATCH",
          { status: "ACCEPTED" }
        );
        if (response) {
            console.log(response.message);
            getFriendsList(); // 친구 목록 갱신
        } else console.error("친구 요청 수락 실패");
    };
    const handleRejectRequest = async (friendId: string) => {
        const response = await axiosRequest<{ message: string }>(
          `/friends/requests/${friendId}`,
          "PATCH",
          { status: "REJECTED" }
        );
        if (response) {
            console.log(response.message);
            getFriendsList(); // 친구 목록 갱신
        } else console.error("친구 요청 거절 실패");
    }
    const handleDeleteRequest = async (friendId: string) => {
        const response = await axiosRequest<{ message: string }>(
          `/friends/requests/${friendId}`,
          "DELETE",
          null
        );
        if (response) {
            console.log('삭제 완료. 응답 메시지: ',response);
            getFriendsList(); // 친구 목록 갱신
        } else console.error("친구 요청 취소 실패");
    }
    const handleSendSignal = async (friendId: string, friendName: string) => {
        const randomIndex = Math.floor(Math.random() * 3);
        
        // ✅ 콜백을 사용하여 최신 값 보장
        setSignalImageIndex(() => {
            console.log("🎲 랜덤 이미지 인덱스 선택:", randomIndex);
            sendSignalRequest(friendId, friendName, randomIndex);
            return randomIndex;
        });
    };
    
    const sendSignalRequest = async (friendId: string, friendName: string, imageIndex: number) => {
        console.log("📤 시그널 보냄. to:", friendId, " | 이미지 인덱스:", imageIndex);
        
        try {
            const response = await axiosRequest<{ message: string }>(
              "/friends/signals",
              "POST",
              {
                receiverId: friendId,
                imageIndex: imageIndex,
              }
            );
    
            if (response) {
                console.log("📩 시그널 보내기 응답:", response.message);
                if (response.message === "Signal sent successfully" || response.message === "You already sent a signal") {
                    handleOpenSendSignalPopup(friendName);
                } else if (response.message === "Invalid or expired token") {
                    navigate("/login");
                }
            } else {
                console.error("❌ 시그널 보내기 실패");
            }
        } catch (error) {
            console.error("❌ 시그널 전송 중 오류:", error);
        }
    };
    const handleReceiveSignal = async () => {
        try {
            const response = await axiosRequest<{ signals: SignalFrom[] }>(
              "/friends/signals",
              "GET",
              null
            );
            if (response) {
                if(response.data.signals.length > 0){
                    console.log("📩 받은 시그널 목록:", response.data.signals);
                    setSignalsQueue(response.data.signals);
                    setCurrentSignalIndex(0);
                    setIsReceiveSignalPopupVisible(true);
                }
            }
        } catch (error) {
            console.error("❌ 시그널 받기 실패:", error);
        }
    };
    const handleDeleteSignal = async () => {
        if (signalsQueue.length === 0) return;

        const currentSignal = signalsQueue[currentSignalIndex];
        try {
            const response = await axiosRequest<{ message: string }>(
              `/friends/signals/${currentSignal.userId}`,
              "DELETE",
              null
            );

            if (response) {
                console.log("🗑️ 시그널 삭제 완료:", response.message);

                // 다음 시그널로 이동
                const nextIndex = currentSignalIndex + 1;
                if (nextIndex < signalsQueue.length) {
                    setCurrentSignalIndex(nextIndex);
                } else {
                    // 모든 시그널이 처리되면 팝업 닫기
                    setIsReceiveSignalPopupVisible(false);
                    setSignalsQueue([]);
                }
            }
        } catch (error) {
            console.error("❌ 시그널 삭제 실패:", error);
        }
    };

    const getFriendsList = async () => {
        try {
            const response = await axiosRequest<Social>(
              "/friends",
              "GET",
              null
            );
            if (response) {
                console.log("📜 친구 목록 불러오기:", response);
                setFriendsData(response.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("❌ 친구 목록 불러오기 실패:", error);
        }
    };
    useEffect(() => {
        getFriendsList();
        handleReceiveSignal();
    }, []);
    useEffect(() => {
        if (friendsData?.friend?.length === 0 && friendsData?.received?.length === 0 && friendsData?.sent?.length === 0) {
            setHasNoFriend(true); // 친구 없음
        } else {
            setHasNoFriend(false); // 친구 있음
        }
    }, [friendsData]);

    return (
        <div className={s.container}>
            {loading && <Pending />}
            {/*================================ 제목 부분 ===================================*/}
            <div className={s.headContainer}>
                <button
                    className={s.backButton}
                    onClick={() => {navigate("/home");}}
                >
                    <img src={backArrow} alt='backArrow' />
                </button>
                <div className={s.title}>
                    <span className={s.titleName}>{userName}</span>
                    <span className={s.titleText}>님의 친구목록</span>
                </div>
            </div>
            {/*================================ 검색창 부분 ==================================*/}
            <div
                onClick={() => {navigate("/searchusers");}}
                className={s.searchBarContainer}
            >
                <SearchUsersBar />
            </div>
            {/*================================ 친구 목록 부분 ================================*/}
                <div className={s.totalFriendsListContainer}>
                <ShowTotalFriendsList
                    friendsData={friendsData}
                    handleDeleteFriend={handleDeleteFriend}
                    handleAcceptRequest={handleAcceptRequest}
                    handleRejectRequest={handleRejectRequest}
                    handleDeleteRequest={handleDeleteRequest}
                    handleSendSignal={handleSendSignal}
                />
                </div>
            {/*================================ 친구가 없을 때 ================================*/}
            {hasNoFriend &&
                <div className={s.noFriend}>
                    <p className={s.noFriendFirstText}>아직 친구가 없어요...</p>
                    <p className={s.noFriendSecondText}>ID를 검색해 친구를 추가해 보세요!</p>
                    <img src={pleiadesLogo} alt="pleiadesLogo" width={176} />
                </div>
            }
            {isSendSignalPopupVisible &&
                <SendSignalPopup
                    username={signalTo}
                    handleCloseSendSignalPopup={handleCloseSendSignalPopup}
                    imageIndex={signalImageIndex}
                />
            }
            {/* ⚡️ 시그널 수신 팝업 */}
            {isReceiveSignalPopupVisible && signalsQueue.length > 0 && (
                <ReceiveSignalPopup
                    username={signalsQueue[currentSignalIndex].userName}
                    handleCloseReceiveSignalPopup={handleDeleteSignal} // 시그널 삭제 후 다음 시그널 표시
                    imageIndex={signalsQueue[currentSignalIndex].imageIndex}
                />
            )}
        </div>
    )
}

export default FriendsTab;
