import React from "react";
import s from "./VisitStationModal.module.scss";

// image files
import characterAvatar from '../../../assets/FriendsTab/characterAvatarModal.png';

interface ModalProps {
    username: string;
    userId: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const VisitStationModal: React.FC<ModalProps> = ({
    username,
    userId,
    onConfirm,
    onCancel,
}) => {
    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                <div className={s.modalAvatar}>
                    <img src={characterAvatar} alt={`${username}'s avatar`} />
                </div>
                <div className={s.modalUserId}>(@{userId})</div>
                <p className={s.modalMessage}>
                    {username}님의 별에 방문할까요?
                </p>
                <div className={s.modalButtons}>
                    <button
                        className={s.modalButtonsConfirm}
                        onClick={onConfirm}
                    >
                        네! 갈래요
                    </button>
                    <button
                        className={s.modalButtonsCancel}
                        onClick={onCancel}
                    >
                        안 갈래요
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisitStationModal;