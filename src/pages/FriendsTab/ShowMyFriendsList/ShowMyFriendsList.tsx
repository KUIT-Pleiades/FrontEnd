import React, { useState } from "react";
import s from "./ShowMyFriendsList.module.scss";
import { OtherUser } from "../../../interfaces/Interfaces";

// components
import DeleteFriendModal from "../../../components/DeleteFriendModal/DeleteFriendModal";
import SignalButton from "../../../components/SignalButton/SignalButton";

//image files
import deleteFriendsButton from "../../../assets/FriendsTab/deleteFriendsButton.svg";
import { useNavigate } from "react-router-dom";

interface ShowMyFriendsListProps {
  otherUser: OtherUser;
  handleDeleteFriend: (id: string) => void;
  handleSendSignal: (id: string, friendName: string) => void;
  onActionFriendId: string;
  setOnActionFriendId: (friendId: string) => void;
}

const ShowMyFriendsList: React.FC<ShowMyFriendsListProps> = ({
  otherUser,
  handleDeleteFriend,
  handleSendSignal,
  onActionFriendId,
  setOnActionFriendId,
}) => {
  const navigate = useNavigate();
  const [isDeleteFriendModalOpen, setIsDeleteFriendModalOpen] = useState(false);
  const userId = otherUser.friendId;
  const handleGoStation = () => {
    navigate("/friendstar", { state: { userId } });
  };

  const handleOpenDeleteFriendModal = () => setIsDeleteFriendModalOpen(true);
  const handleCloseDeleteFriendModal = () => setIsDeleteFriendModalOpen(false);
  const handleDelete = (id: string) => {
    handleDeleteFriend(id);
    handleCloseDeleteFriendModal();
    setOnActionFriendId("");
  };
  const handleDeleteCancel = () => {
    handleCloseDeleteFriendModal();
    setOnActionFriendId("");
  };

  const RenderButtons = () => {
    if (onActionFriendId === otherUser.userId) {
      return (
        <button
          className={s.showDeleteFriendModalButton}
          onClick={handleOpenDeleteFriendModal}
        >
          친구 삭제
        </button>
      );
    }
    return (
      <SignalButton
        onClickSignal={() =>
          handleSendSignal(otherUser.userId, otherUser.userName)
        }
      />
    );
  };

  return (
    <div className={s.container}>
      <div className={s.userInfoContainer} onClick={handleGoStation}>
        {/*============= 프로필 사진 =============*/}
        <div className={s.profileImageContainer}>
          <img
            src={otherUser.profile}
            alt={`${otherUser.userName}의 프로필 이미지`}
            className={s.profileImage}
          />
        </div>
        {/*============= 이름, ID =============*/}
        <div className={s.nameId}>
          <p>{otherUser.userName}</p>
          <p>@{otherUser.userId}</p>
        </div>
      </div>
      <div className={s.emptySpace} onClick={handleGoStation} />
      {/*============= 버튼 =============*/}
      <div className={s.buttonContainer}>
        <RenderButtons />

        <button
          className={s.deleteFriendsButton}
          onClick={() => {
            if (onActionFriendId === otherUser.userId) {
              setOnActionFriendId("");
            } else {
              setOnActionFriendId(otherUser.userId);
            }
          }}
        >
          <img src={deleteFriendsButton} alt="deleteFriendsButton" />
        </button>
      </div>
      {isDeleteFriendModalOpen && (
        <DeleteFriendModal
          username={otherUser.userName}
          userId={otherUser.userId}
          profile={otherUser.profile}
          onClose={handleDeleteCancel}
          onDelete={() => handleDelete(otherUser.userId)}
        />
      )}
    </div>
  );
};

export default ShowMyFriendsList;
