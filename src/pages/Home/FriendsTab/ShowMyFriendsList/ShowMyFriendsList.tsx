import React, { useState } from 'react';
import s from './ShowMyFriendsList.module.scss';
import { OtherUser } from '../../../../interfaces/Interfaces';

import profileImageSmall from '../../../../assets/profileImageSmall.png';
import goStationSmall from '../../../../assets/goStationSmall.svg';
import poke from '../../../../assets/poke.svg';
import VisitStationModal from '../VisitStationModal/visitStationModal';

interface ShowMyFriendsListProps {
    otherUser: OtherUser;
}

const ShowMyFriendsList: React.FC<ShowMyFriendsListProps> = ({ otherUser }) => {
  const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleConfirm = () => {
        console.log("네! 갈래요 선택");
        handleCloseModal();
    };
    const handleCancel = () => {
        console.log("안 갈래요 선택");
        handleCloseModal();
    };

  return (
    <div className={s.container}>
      <div className={s.profileImage}>
        <img src={profileImageSmall} alt="profileImageSmall" />
      </div>
      <div className={s.nameId}>
        <p>{otherUser.Name}</p>
        <p>@{otherUser.Id}</p>
      </div>
      <div className={s.buttonContainer}>
        <button className={s.goStationButton} onClick={handleOpenModal}>
          <img src={goStationSmall} alt="goStationSmall" />
        </button>
        <button className={s.pokeButton}>
          <img src={poke} alt="poke" />
        </button>
      </div>
      {isModalOpen && (
        <VisitStationModal
          username={otherUser.Name}
          userId={otherUser.Id}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default ShowMyFriendsList;
