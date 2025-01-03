import React from 'react';
import s from './ShowMyFriendsList.module.scss';
import { OtherUser } from '../../../../interfaces/Interfaces';

import profileImageSmall from '../../../../assets/profileImageSmall.png';

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
        <button className={s.acceptButton}>수락</button>
        <button className={s.declineButton}>거절</button>
      </div>
    </div>
  )
}

export default ShowMyFriendsList;
