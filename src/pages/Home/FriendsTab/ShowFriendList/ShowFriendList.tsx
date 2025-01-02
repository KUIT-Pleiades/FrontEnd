import React from 'react';
import s from './ShowFriendList.module.scss';
import { OtherUser } from '../../../../interfaces/Interfaces';

interface ShowFriendListProps {
    otherUser: OtherUser;
}

const ShowFriendList: React.FC<ShowFriendListProps> = ({ otherUser }) => {
  return (
    <div className={s.container}>
      {otherUser.Name}
      {otherUser.Id}
    </div>
  )
}

export default ShowFriendList;
