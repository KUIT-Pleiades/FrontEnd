import React, { useState } from 'react';
import s from './ShowMyRequestsList.module.scss';
import { OtherUser } from '../../../interfaces/Interfaces';

//image files

interface ShowMyRequestsListProps {
    otherUser: OtherUser;
    handleDeleteRequest: (id: string) => void;
}

const ShowMyRequestsList: React.FC<ShowMyRequestsListProps> = ({ otherUser, handleDeleteRequest }) => {
  const [isCancelRequestPopupVisible, setisCancelRequestPopupVisible] = useState(false);

  const showCancelRequestPopup = () => {
    setisCancelRequestPopupVisible(true);
    setTimeout(() => {
      setisCancelRequestPopupVisible(false);
    }, 1500);
  };

  return (
    <div className={s.container}>
      
      <div className={s.userInfoContainer}>
        {/*============= 프로필 사진 =============*/}
        <div className={s.profileImageContainer}>
          <img src={otherUser.profile} alt={`${otherUser.userName}의 프로필 이미지`} className={s.profileImage} />
        </div>
        {/*============= 이름, ID =============*/}
        <div className={s.nameId}>
          <p>{otherUser.userName}</p>
          <p>@{otherUser.userId}</p>
        </div>
      </div>
      {/*============= 버튼 =============*/}
      <div className={s.buttonContainer}>
        <button
          className={s.cancelButton}
          onClick={() => {
            handleDeleteRequest(otherUser.userId)
            showCancelRequestPopup();
          }}
        >취소</button>
      </div>
      {isCancelRequestPopupVisible && (
        <div className={s.cancelRequestPopup}>
          {`${otherUser.userName} 님 요청을 취소했어요`}
        </div>
      )}
    </div>
  )
}

export default ShowMyRequestsList;
