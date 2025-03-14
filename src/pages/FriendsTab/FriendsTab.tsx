import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './FriendsTab.module.scss';
import { useCharacterStore } from '../../store/useCharacterStore';

// components
import ShowTotalFriendsList from './ShowTotalFriendsList/ShowTotalFriendsList';
import SearchUsersBar from '../../components/SearchUsersBar/SearchUsersBar';
import SendSignalPopup from './SendSignalPopup/SendSignalPopup';
import ReceiveSignalPopup from './ReceiveSignalPopup/ReceiveSignalPopup';

// image files
import pleiadesLogo from '../../assets/FriendsTab/pleiadesLogoNoFriends.png';
import backArrow from '../../assets/FriendsTab/backArrow.svg';
import Pending from '../PageManagement/Pending';

import axiosInstance from '../../api/axiosInstance';
import { FriendsData, SignalFrom } from '../../interfaces/Interfaces';

const FriendsTab: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useCharacterStore();
  const userName = userInfo.userName || "플레이아데스";

  const [loading, setLoading] = useState<boolean>(true);
  const [friendsData, setFriendsData] = useState<FriendsData>({ received: [], friend: [], sent: [] });
  const [hasNoFriend, setHasNoFriend] = useState<boolean>(false);

  // 시그널 관련 상태
  const [signalTo, setSignalTo] = useState<string>("");
  const [signalImageIndex, setSignalImageIndex] = useState<number>(0);
  const [isSendSignalPopupVisible, setIsSendSignalPopupVisible] = useState<boolean>(false);

  const [signalsQueue, setSignalsQueue] = useState<SignalFrom[]>([]);
  const [currentSignalIndex, setCurrentSignalIndex] = useState<number>(0);
  const [isReceiveSignalPopupVisible, setIsReceiveSignalPopupVisible] = useState<boolean>(false);

  const handleOpenSendSignalPopup = (friendName: string) => {
    setSignalTo(friendName);
    setIsSendSignalPopupVisible(true);
  };

  const handleCloseSendSignalPopup = () => {
    setIsSendSignalPopupVisible(false);
    setSignalTo("");
  };

  // 친구 목록 불러오기
  const getFriendsList = async () => {
    try {
      const response = await axiosInstance.get<FriendsData>("/friends");
      console.log("친구 목록 불러오기:", response.data);
      setFriendsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("친구 목록 불러오기 실패:", error);
    }
  };

  // 친구 삭제
  const handleDeleteFriend = async (friendId: string) => {
    try {
      const response = await axiosInstance.delete<{ message: string }>(`/friends/requests/${friendId}`);
      console.log("친구 삭제 완료:", response.data.message);
      getFriendsList();
    } catch (error) {
      console.error("친구 삭제 실패:", error);
    }
  };

  // 친구 요청 수락
  const handleAcceptRequest = async (friendId: string) => {
    try {
      const response = await axiosInstance.patch<{ message: string }>(`/friends/requests/${friendId}`, { status: "ACCEPTED" });
      console.log("친구 요청 수락:", response.data.message);
      getFriendsList();
    } catch (error) {
      console.error("친구 요청 수락 실패:", error);
    }
  };

  // 친구 요청 거절
  const handleRejectRequest = async (friendId: string) => {
    try {
      const response = await axiosInstance.patch<{ message: string }>(`/friends/requests/${friendId}`, { status: "REJECTED" });
      console.log("친구 요청 거절:", response.data.message);
      getFriendsList();
    } catch (error) {
      console.error("친구 요청 거절 실패:", error);
    }
  };

  // 친구 요청 취소
  const handleDeleteRequest = async (friendId: string) => {
    try {
      const response = await axiosInstance.delete<{ message: string }>(`/friends/requests/${friendId}`);
      console.log("친구 요청 취소 완료:", response.data.message);
      getFriendsList();
    } catch (error) {
      console.error("친구 요청 취소 실패:", error);
    }
  };

  // 시그널 보내기
  const handleSendSignal = async (friendId: string, friendName: string) => {
    const randomIndex = Math.floor(Math.random() * 3);
    setSignalImageIndex(randomIndex);
    console.log("랜덤 이미지 인덱스 선택:", randomIndex);
    try {
      const response = await axiosInstance.post<{ message: string }>('/friends/signals', {
        receiverId: friendId,
        imageIndex: randomIndex,
      });
      console.log("시그널 보내기 응답:", response.data.message);
      if (response.data.message === "Signal sent successfully" || response.data.message === "You already sent a signal") {
        handleOpenSendSignalPopup(friendName);
      } else if (response.data.message === "Invalid or expired token") {
        navigate("/login");
      }
    } catch (error) {
      console.error("시그널 보내기 실패:", error);
    }
  };

  // 시그널 받기
  const handleReceiveSignal = async () => {
    try {
      const response = await axiosInstance.get<{ signals: SignalFrom[] }>('/friends/signals');
      if (response.data.signals.length > 0) {
        console.log("받은 시그널 목록:", response.data.signals);
        setSignalsQueue(response.data.signals);
        setCurrentSignalIndex(0);
        setIsReceiveSignalPopupVisible(true);
      }
    } catch (error) {
      console.error("시그널 받기 실패:", error);
    }
  };

  // 시그널 삭제 (현재 시그널)
  const handleDeleteSignal = async () => {
    if (signalsQueue.length === 0) return;
    const currentSignal = signalsQueue[currentSignalIndex];
    try {
      const response = await axiosInstance.delete<{ message: string }>(`/friends/signals/${currentSignal.userId}`);
      console.log("시그널 삭제 완료:", response.data.message);
      const nextIndex = currentSignalIndex + 1;
      if (nextIndex < signalsQueue.length) {
        setCurrentSignalIndex(nextIndex);
      } else {
        setIsReceiveSignalPopupVisible(false);
        setSignalsQueue([]);
      }
    } catch (error) {
      console.error("시그널 삭제 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 친구 목록 및 시그널 불러오기
  useEffect(() => {
    getFriendsList();
    handleReceiveSignal();
  }, []);

  // 친구가 없을 경우 상태 업데이트
  useEffect(() => {
    if (
      friendsData.friend.length === 0 &&
      friendsData.received.length === 0 &&
      friendsData.sent.length === 0
    ) {
      setHasNoFriend(true);
    } else {
      setHasNoFriend(false);
    }
  }, [friendsData]);

  return (
    <div className={s.container}>
      {loading && <Pending />}
      {/* 제목 부분 */}
      <div className={s.headContainer}>
        <button className={s.backButton} onClick={() => navigate("/home")}>
          <img src={backArrow} alt="backArrow" />
        </button>
        <div className={s.title}>
          <span className={s.titleName}>{userName}</span>
          <span className={s.titleText}>님의 친구목록</span>
        </div>
      </div>
      {/* 검색창 부분 */}
      <div onClick={() => navigate("/searchusers")} className={s.searchBarContainer}>
        <SearchUsersBar />
      </div>
      {/* 친구 목록 부분 */}
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
      {/* 친구가 없을 때 */}
      {hasNoFriend && (
        <div className={s.noFriend}>
          <p className={s.noFriendFirstText}>아직 친구가 없어요...</p>
          <p className={s.noFriendSecondText}>ID를 검색해 친구를 추가해 보세요!</p>
          <img src={pleiadesLogo} alt="pleiadesLogo" width={176} />
        </div>
      )}
      {/* 시그널 보내기 팝업 */}
      {isSendSignalPopupVisible && (
        <SendSignalPopup
          username={signalTo}
          handleCloseSendSignalPopup={handleCloseSendSignalPopup}
          imageIndex={signalImageIndex}
        />
      )}
      {/* 시그널 수신 팝업 */}
      {isReceiveSignalPopupVisible && signalsQueue.length > 0 && (
        <ReceiveSignalPopup
          username={signalsQueue[currentSignalIndex].userName}
          handleCloseReceiveSignalPopup={handleDeleteSignal}
          imageIndex={signalsQueue[currentSignalIndex].imageIndex}
        />
      )}
    </div>
  );
};

export default FriendsTab;