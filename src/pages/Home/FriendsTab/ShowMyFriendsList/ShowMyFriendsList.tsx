import React from 'react';
import s from './ShowMyFriendsList.module.scss';
import { OtherUser } from '../../../../interfaces/Interfaces';

import profileImageSmall from '../../../../assets/profileImageSmall.png';
import goStationSmall from '../../../../assets/goStationSmall.svg';
import poke from '../../../../assets/poke.svg';

interface ShowMyFriendsListProps {
    otherUser: OtherUser;
}

const ShowMyFriendsList: React.FC<ShowMyFriendsListProps> = ({ otherUser }) => {
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
        <button className={s.goStationButton}>
          <img src={goStationSmall} alt="goStationSmall" />
        </button>
        <button className={s.pokeButton}>
          <img src={poke} alt="poke" />
        </button>
      </div>
    </div>
  )
}

export default ShowMyFriendsList;
