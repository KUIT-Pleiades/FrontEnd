import React from "react";
import s from './DeleteFriendModal.module.scss';

// image files
import characterAvatar from '../../../assets/FriendsTab/characterAvatarModal.png';

interface ModalProps {
    username: string;
    userId: string;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteFriendModal: React.FC<ModalProps> = ({
    username,
    userId,
    onClose,
    onDelete,
}) => {

  return (
    <div className={s.modalOverlay}>
        <div className={s.modal}>
            <div className={s.modalAvatar}>
                <img src={characterAvatar} alt={`${username}'s avatar`} />
            </div>
            <div className={s.modalUserId}>(@{userId})</div>
            <p className={s.modalMessage}>{username}님을 친구에서 삭제할까요?</p>
            <div className={s.modalButtons}>
                <button className={s.modalButtonsDelete} onClick={onDelete}>
                삭제할래요
                </button>
                <button className={s.modalButtonsCancel} onClick={onClose}>
                취소할래요
                </button>
            </div>
        </div>
    </div>
  );
};

export default DeleteFriendModal;