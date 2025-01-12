import React, { useState } from 'react';
import s from './ShowMyRequestsList.module.scss';
import { OtherUser } from '../../../interfaces/Interfaces';

//image files
import profileImageSmall from '../../../assets/FriendsTab/profileImageSmall.png';

interface ShowMyRequestsListProps {
    otherUser: OtherUser;
}

const ShowMyRequestsList: React.FC<ShowMyRequestsListProps> = ({ otherUser }) => {
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
        <button
          className={s.cancelButton}
          onClick={() => {
            showCancelRequestPopup();
          }}
        >취소</button>
      </div>
      {isCancelRequestPopupVisible && (
        <div className={s.cancelRequestPopup}>
          {`${otherUser.Name} 님 요청을 취소했어요`}
        </div>
      )}
    </div>
  )
}

export default ShowMyRequestsList;
