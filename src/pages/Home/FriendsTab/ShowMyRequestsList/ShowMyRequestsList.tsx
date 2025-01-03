import React from 'react';
import s from './ShowMyRequestsList.module.scss';
import { OtherUser } from '../../../../interfaces/Interfaces';

import profileImageSmall from '../../../../assets/profileImageSmall.png';

interface ShowMyRequestsListProps {
    otherUser: OtherUser;
}

const ShowMyRequestsList: React.FC<ShowMyRequestsListProps> = ({ otherUser }) => {
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
        <button className={s.cancelButton}>취소</button>
      </div>
    </div>
  )
}

export default ShowMyRequestsList;
