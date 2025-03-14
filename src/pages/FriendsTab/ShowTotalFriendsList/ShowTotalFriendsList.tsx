import React, { useEffect, useMemo, useState } from "react";
import s from "./ShowTotalFriendsList.module.scss";

// components
import ShowFriendRequestsList from "../ShowFriendRequestsList/ShowFriendRequestsList";
import ShowMyFriendsList from "../ShowMyFriendsList/ShowMyFriendsList";
import ShowMyRequestsList from "../ShowMyRequestsList/ShowMyRequestsList";
import SortCriteriaBox from "../../../components/SortCriteriaBox/SortCriteriaBox";

// image files
import hideUpArrow from "../../../assets/FriendsTab/hideUpArrow.svg";
import showDownArrow from "../../../assets/FriendsTab/showDownArrow.svg";
import toggleDown from "../../../assets/FriendsTab/toggleDown.svg";
import toggleUp from "../../../assets/FriendsTab/toggleUp.svg";
import { FriendsData } from "../../../interfaces/Interfaces";

interface ShowTotalFriendsListProps {
  friendsData: FriendsData;
  handleDeleteFriend: (friendId: string) => void;
  handleAcceptRequest: (friendId: string) => void;
  handleRejectRequest: (friendId: string) => void;
  handleDeleteRequest: (friendId: string) => void;
  handleSendSignal: (friendId: string, friendName: string) => void;
}

const ShowTotalFriendsList: React.FC<ShowTotalFriendsListProps> = ({
  friendsData,
  handleDeleteFriend,
  handleAcceptRequest,
  handleRejectRequest,
  handleDeleteRequest,
  handleSendSignal,
}) => {
  const [isShowFriendRequests, setIsShowFriendRequests] = useState<boolean>(true);
  const [isShowMyFriends, setIsShowMyFriends] = useState<boolean>(true);
  const [isShowMyRequests, setIsShowMyRequests] = useState<boolean>(true);
  const [onActionFriendId, setOnActionFriendId] = useState<string>("");
  const [showAllFriends, setShowAllFriends] = useState<boolean>(false);
  const [sortCriteria, setSortCriteria] = useState<"최신순" | "이름순">("최신순");

  const sortedByRecent = useMemo(() => [...(friendsData.friend ?? [])], [friendsData.friend]);

  const sortedByName = useMemo(() => {
    return [...(friendsData.friend ?? [])].sort((a, b) => {
      const isAKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(a.userName);
      const isBKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(b.userName);

      if (isAKorean && !isBKorean) return -1;
      if (!isAKorean && isBKorean) return 1;

      return a.userName.localeCompare(b.userName, "ko-KR", { sensitivity: "base" });
    });
  }, [friendsData.friend]);

  const sortedFriends = sortCriteria === "최신순" ? sortedByRecent : sortedByName;

  useEffect(() => {
    if (!friendsData) return; // friendsData가 없으면 실행하지 않음
    if (Array.isArray(friendsData.received) && friendsData.received.length === 0) setIsShowFriendRequests(false);
    if (Array.isArray(friendsData.friend) && friendsData.friend.length === 0) setIsShowMyFriends(false);
    if (Array.isArray(friendsData.sent) && friendsData.sent.length === 0) setIsShowMyRequests(false);
  }, [friendsData]);

  return (
    <div className={s.friendsList}>
      {/*============= 받은 친구 요청 리스트 =============*/}
      <div className={s.friendRequests}>
        <div
          className={s.friendRequestsHead}
          onClick={() => setIsShowFriendRequests(!isShowFriendRequests)}
          style={!isShowFriendRequests ? { marginBottom: "1.44rem" } : {}}
        >
          <button
            className={s.showHideButton}
          >
            {isShowFriendRequests ? (
              <img src={hideUpArrow} alt="hideUpArrow" />
            ) : (
              <img src={showDownArrow} alt="showDown" />
            )}
          </button>
          <span>친구 요청 왔어요 ({friendsData?.received?.length || 0})</span>
        </div>
        {friendsData?.received && isShowFriendRequests && (
          <div className={s.friendRequestsSection}>
            {friendsData.received.map((friend) => (
              <div key={friend.userId} className={s.friendRequest}>
                <ShowFriendRequestsList
                  otherUser={friend}
                  handleAcceptRequest={handleAcceptRequest}
                  handleRejectRequest={handleRejectRequest}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/*============= 내 친구 리스트 =============*/}
      <div className={s.myFriends}>
        <div
          className={s.myFriendsHead}
          style={!isShowMyFriends ? { marginBottom: "1.44rem" } : {}}
          onClick={() => setIsShowMyFriends(!isShowMyFriends)}
        >
          <button
            className={s.showHideButton}
          >
            {isShowMyFriends ? (
              <img src={hideUpArrow} alt="hideUpArrow" />
            ) : (
              <img src={showDownArrow} alt="showDown" />
            )}
          </button>
          <span>내 친구 ({friendsData?.friend?.length || 0})</span>
        </div>

        {friendsData?.friend && isShowMyFriends && (
          <div className={s.myFriendsSectionContainer}>
            <div className={s.sortCriteriaBoxContainer}>
              <SortCriteriaBox
                sortCriteria={sortCriteria}
                setSortCriteria={setSortCriteria}
              />
            </div>
            <div className={s.myFriendsSection}>
              {sortedFriends.slice(0, showAllFriends ? sortedFriends.length : 7).map((friend) => (
                <div key={friend.userId} className={s.myFriend}>
                  <ShowMyFriendsList
                    otherUser={friend}
                    handleDeleteFriend={handleDeleteFriend}
                    handleSendSignal={handleSendSignal}
                    onActionFriendId={onActionFriendId}
                    setOnActionFriendId={setOnActionFriendId}
                  />
                </div>
              ))}
            </div>
            {sortedFriends.length > 7 && (
              <button
                className={s.toggleButton}
                onClick={() => setShowAllFriends((prev) => !prev)}
              >
                {showAllFriends ? "접기" : "더보기"}
                {showAllFriends ?
                  <img src={toggleUp} alt="toggleUp" className={s.toggleIcon} /> :
                  <img src={toggleDown} alt="toggleDown" className={s.toggleIcon} />
                }
              </button>
            )}
          </div>
        )}
      </div>
      {/*============= 내가 친구 요청 보낸 리스트 =============*/}
      <div className={s.myRequests}>
        <div
          className={s.myRequestsHead}
          onClick={() => setIsShowMyRequests(!isShowMyRequests)}
        >
          <button
            className={s.showHideButton}
          >
            {isShowMyRequests ? (
              <img src={hideUpArrow} alt="hideUpArrow" />
            ) : (
              <img src={showDownArrow} alt="showDown" />
            )}
          </button>
          <span>요청 중인 친구 ({friendsData?.sent?.length || 0})</span>
        </div>
        {friendsData?.sent && isShowMyRequests && (
          <div className={s.myRequestsSection}>
            {friendsData.sent.map((friend) => (
              <div key={friend.userId} className={s.myRequest}>
                <ShowMyRequestsList
                  otherUser={friend}
                  handleDeleteRequest={handleDeleteRequest}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTotalFriendsList;