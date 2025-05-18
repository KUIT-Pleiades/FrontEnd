import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './FriendsTab.module.scss';
import { useCharacterStore } from '../../store/useCharacterStore';
import ShowTotalFriendsList from './ShowTotalFriendsList/ShowTotalFriendsList';
import SearchUsersBar from '../../components/SearchUsersBar/SearchUsersBar';
import { axiosRequest } from '../../functions/axiosRequest';
import SendSignalPopup from './SendSignalPopup/SendSignalPopup';
import ReceiveSignalPopup from './ReceiveSignalPopup/ReceiveSignalPopup';
import Pending from '../PageManagement/Pending';
import { SignalFrom, Social } from '../../interfaces/Interfaces';
import pleiadesLogo from '../../assets/FriendsTab/pleiadesLogoNoFriends.png';
import backArrow from '../../assets/FriendsTab/backArrow.svg';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 🔧 axios 응답 구조에 맞게 response.data 리턴
const getFriendsList = async (): Promise<Social> => {
  const response = await axiosRequest<Social>("/friends", "GET", null);
  return response?.data ?? { received: [], friend: [], sent: [] }; // ✅ .data로 접근
};

const FriendsTab: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userInfo } = useCharacterStore();
  const userName = userInfo.userName || "플레이아데스";

  const { data: friendsData = { received: [], friend: [], sent: [] }, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriendsList,
  });

  const [hasNoFriend, setHasNoFriend] = useState(false);
  const [signalTo, setSignalTo] = useState("");
  const [signalImageIndex, setSignalImageIndex] = useState(0);
  const [isSendSignalPopupVisible, setIsSendSignalPopupVisible] = useState(false);
  const [signalsQueue, setSignalsQueue] = useState<SignalFrom[]>([]);
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [isReceiveSignalPopupVisible, setIsReceiveSignalPopupVisible] = useState(false);

  
  const handleDeleteFriend = async (friendId: string) => {
    const res = await axiosRequest(`/friends/requests/${friendId}`, "DELETE", null);
    if (res) queryClient.invalidateQueries({ queryKey: ["friends"] });
  };
  
  const handleAcceptRequest = async (friendId: string) => {
    const res = await axiosRequest(`/friends/requests/${friendId}`, "PATCH", { status: "ACCEPTED" });
    if (res) queryClient.invalidateQueries({ queryKey: ["friends"] });
  };
  
  const handleRejectRequest = async (friendId: string) => {
    const res = await axiosRequest(`/friends/requests/${friendId}`, "PATCH", { status: "REJECTED" });
    if (res) queryClient.invalidateQueries({ queryKey: ["friends"] });
  };
  
  const handleDeleteRequest = async (friendId: string) => {
    const res = await axiosRequest(`/friends/requests/${friendId}`, "DELETE", null);
    if (res) queryClient.invalidateQueries({ queryKey: ["friends"] });
  };

  const handleOpenSendSignalPopup = (friendName: string) => {
    setSignalTo(friendName);
    setIsSendSignalPopupVisible(true);
  };

  const handleCloseSendSignalPopup = () => {
    setIsSendSignalPopupVisible(false);
    setSignalTo("");
  };

  const handleSendSignal = async (friendId: string, friendName: string) => {
    const randomIndex = Math.floor(Math.random() * 3);
    setSignalImageIndex(() => {
      sendSignalRequest(friendId, friendName, randomIndex);
      return randomIndex;
    });
  };

  const sendSignalRequest = async (friendId: string, friendName: string, imageIndex: number) => {
    try {
      const response = await axiosRequest<{ message: string }>(
        "/friends/signals",
        "POST",
        {
          receiverId: friendId,
          imageIndex: imageIndex,
        }
      );
  
      if (response.data.message === "Signal sent successfully" || response.data.message === "You already sent a signal") {
        handleOpenSendSignalPopup(friendName);
      } else if (response.data.message === "Invalid or expired token") {
        navigate("/login");
      }
    } catch (error) {
      console.error("시그널 전송 중 오류:", error);
    }
  };

  const handleReceiveSignal = async () => {
    try {
      const response = await axiosRequest<{ signals: SignalFrom[] }>(
        "/friends/signals",
        "GET",
        null
      );
  
      if (response.data.signals.length > 0) {
        //setIsClearAllSignal(false);
        setSignalsQueue(response.data.signals);
        setCurrentSignalIndex(0);
        setIsReceiveSignalPopupVisible(true);
      }
    } catch (error) {
      console.error("시그널 수신 실패:", error);
    }
  };

  const closeSignalPopup = () => {
    const currentSignal = signalsQueue[currentSignalIndex];
    const nextIndex = currentSignalIndex + 1;
    if (nextIndex < signalsQueue.length) {
      setCurrentSignalIndex(nextIndex);
    } else {
      setSignalsQueue([]);
      setIsReceiveSignalPopupVisible(false);
    }
    handleDeleteSignal(currentSignal);
  }

  const handleDeleteSignal = async (currentSignal: SignalFrom) => {
    try {
      const res = await axiosRequest(`/friends/signals/${currentSignal.userId}`, "DELETE", null);
      if (res) {
        console.log("시그널 삭제 성공");
      } else {
        console.log("시그널 삭제 실패");
      }
    } catch (e) {
      console.error("시그널 삭제 실패:", e);
    }
  };

  useEffect(() => {
    setHasNoFriend(
      friendsData.friend.length === 0 &&
      friendsData.received.length === 0 &&
      friendsData.sent.length === 0
    );
  }, [friendsData]);

  useEffect(() => {
    handleReceiveSignal();
  }, []);

  return (
    <div className={s.container}>
      {isLoading && <Pending />}
      <div className={s.headContainer}>
        <button className={s.backButton} onClick={() => navigate("/home")}>
          <img src={backArrow} alt="backArrow" />
        </button>
        <div className={s.title}>
          <span className={s.titleName}>{userName}</span>
          <span className={s.titleText}>님의 친구목록</span>
        </div>
      </div>

      <div onClick={() => navigate("/searchusers")} className={s.searchBarContainer}>
        <SearchUsersBar />
      </div>

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

      {hasNoFriend && (
        <div className={s.noFriend}>
          <p className={s.noFriendFirstText}>아직 친구가 없어요...</p>
          <p className={s.noFriendSecondText}>ID를 검색해 친구를 추가해 보세요!</p>
          <img src={pleiadesLogo} alt="pleiadesLogo" width={176} />
        </div>
      )}

      {isSendSignalPopupVisible && (
        <SendSignalPopup
          username={signalTo}
          handleCloseSendSignalPopup={handleCloseSendSignalPopup}
          imageIndex={signalImageIndex}
        />
      )}

      {isReceiveSignalPopupVisible && signalsQueue.length > 0 && (
        <ReceiveSignalPopup
          username={signalsQueue[currentSignalIndex].userName}
          handleCloseReceiveSignalPopup={closeSignalPopup}
          imageIndex={signalsQueue[currentSignalIndex].imageIndex}
        />
      )}
    </div>
  );
};

export default FriendsTab;