import React, { useState } from 'react';
import s from './ShowMyFriendsList.module.scss';
import { OtherUser } from '../../../interfaces/Interfaces';

// components
import VisitStationModal from '../VisitStationModal/VisitStationModal';
import DeleteFriendModal from '../DeleteFriendModal/DeleteFriendModal';

//image files
import profileImageSmall from '../../../assets/FriendsTab/profileImageSmall.png';
import goStationSmall from '../../../assets/FriendsTab/goStationSmall.svg';
import poke from '../../../assets/FriendsTab/poke.svg';
import onPoke from '../../../assets/FriendsTab/onPoke.svg';
import pokePopupStars from '../../../assets/FriendsTab/pokePopupStars.svg';
import deleteFriendsButton from '../../../assets/FriendsTab/deleteFriendsButton.svg';

interface ShowMyFriendsListProps {
    otherUser: OtherUser;
    handleDeleteFriend: () => void;
}

const ShowMyFriendsList: React.FC<ShowMyFriendsListProps> = ({ otherUser, handleDeleteFriend }) => {
  const [isVisitStationModalOpen, setIsVisitStationModalOpen] = useState(false);
  const [onDeleteMode, setOnDeleteMode] = useState(false);
  const [isDeleteFriendModalOpen, setIsDeleteFriendModalOpen] = useState(false);
  const [isPokePopupVisible, setIsPokePopupVisible] = useState(false);

    const handleOpenVisitStationModal = () => setIsVisitStationModalOpen(true);
    const handleCloseVisitStationModal = () => setIsVisitStationModalOpen(false);
    const handleConfirm = () => {
        //console.log("네! 갈래요 선택");
        handleCloseVisitStationModal();
    };
    const handleCancel = () => {
        //console.log("안 갈래요 선택");
        handleCloseVisitStationModal();
    };

    const handleOpenDeleteFriendModal = () => setIsDeleteFriendModalOpen(true);
    const handleCloseDeleteFriendModal = () => setIsDeleteFriendModalOpen(false);
    const handleDelete = () => {
      handleDeleteFriend();
      handleCloseDeleteFriendModal();
      setOnDeleteMode(false);
    };
    const handleDeleteCancel = () => {
      //console.log("안 갈래요 선택");
      handleCloseDeleteFriendModal();
      setOnDeleteMode(false);
    };

    const showPokePopup = () => {
      setIsPokePopupVisible(true);
      setTimeout(() => {
        setIsPokePopupVisible(false);
      }, 1500);
    };

    const RenderButtons = () => {
      if (onDeleteMode) {
        return (
          <button
            className={s.showDeleteFriendModalButton}
            onClick={handleOpenDeleteFriendModal}
          >친구 삭제</button>
        );
      }
      return (
        <>
          <button className={s.goStationButton} onClick={handleOpenVisitStationModal}>
            <img src={goStationSmall} alt="goStationSmall" />
          </button>
          {isPokePopupVisible ? (
            <button className={s.onPokeButton}>
              <img src={onPoke} alt="onPoke" />
            </button>
          ) : (
            <button className={s.pokeButton} onClick={showPokePopup}>
              <img src={poke} alt="poke" />
            </button>
          )}
        </>
      );
    };

  return (
    <div className={s.container}>

      <div className={s.userInfoContainer}>
        {/*============= 프로필 사진 =============*/}
        <div className={s.profileImage}>
          <img src={profileImageSmall} alt="profileImageSmall" width={34} />
        </div>
        {/*============= 이름, ID =============*/}
        <div className={s.nameId}>
          <p>{otherUser.Name}</p>
          <p>@{otherUser.Id}</p>
        </div>
      </div>
      {/*============= 버튼 =============*/}
      <div className={s.buttonContainer}>
        <RenderButtons />

        <button
          className={s.deleteFriendsButton}
          onClick={() => {
            setOnDeleteMode(!onDeleteMode);
          }}>
          <img src={deleteFriendsButton} alt='deleteFriendsButton' />
        </button>
      </div>
      {isVisitStationModalOpen && (
        <VisitStationModal
          username={otherUser.Name}
          userId={otherUser.Id}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {isDeleteFriendModalOpen && (
        <DeleteFriendModal
          username={otherUser.Name}
          userId={otherUser.Id}
          onClose={handleDeleteCancel}
          onDelete={handleDelete}
        />
      )}
      {isPokePopupVisible && (
        <div className={s.pokePopup}>
          <img src={pokePopupStars} alt='pokePopupStars' className={s.pokePopupStarsUp} />
          {`${otherUser.Name}님을 쿡 찔렀어요!`}
          <img src={pokePopupStars} alt='pokePopupStars' className={s.pokePopupStarsDown} />
        </div>
      )}
    </div>
  )
}

export default ShowMyFriendsList;
