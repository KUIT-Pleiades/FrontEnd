import React, { useState } from 'react';
import s from './ShowSearchedUser.module.scss';

// 이미지 파일
import deleteFriendsButton from '../../../../assets/SearchUsers/deleteFriendsButton.svg';

// 컴포넌트
import DeleteFriendModal from '../../../../components/DeleteFriendModal/DeleteFriendModal';
import SignalButton from '../../../../components/SignalButton/SignalButton';
import { SocialUser } from '../../../../interfaces/Interfaces';

interface SearchedUserProps {
    user: SocialUser;
    handleSendRequestFriend: (friendId: string) => void;
    handleDeleteRequest: (friendId: string, type: "REQUEST" | "FRIEND") => void;
    handleRejectRequest: (friendId: string) => void;
    handleSendSignal: (friendId: string) => void;
    handleAcceptRequest: (friendId: string) => void;
    handleAddSearchHistory: (searchedId: string) => void;
}

const ShowSearchedUser: React.FC<SearchedUserProps> = ({
    user,
    handleSendRequestFriend,
    handleDeleteRequest,
    handleRejectRequest,
    handleAcceptRequest,
    handleSendSignal,
    handleAddSearchHistory,
}) => {
    const [showDeleteFriendButton, setShowDeleteFriendButton] = useState(false);
    const [isDeleteFriendModalOpen, setIsDeleteFriendModalOpen] = useState(false);
    
    // ✅ 팝업 상태 (이제 개별 유저마다 관리됨)
    const [popupType, setPopupType] = useState<"ACCEPT" | "REFUSE" | "WITHDRAW" | "SEND" | null>(null);

    // ✅ 팝업 표시 함수
    const showPopup = (type: "REFUSE" | "WITHDRAW" | "SEND") => {
        setPopupType(type);
        setTimeout(() => {
            setPopupType(null);
        }, 1500); // 1.5초 후 자동 닫힘
    };

    // 버튼 렌더링 함수
    const renderButton = () => {
        switch (user.status) {
            case "FRIEND":
                return (
                    <div className={s.buttonContainer}>
                        {showDeleteFriendButton ? (
                            <button
                                className={s.showDeleteFriendModalButton}
                                onClick={() => {
                                    setIsDeleteFriendModalOpen(true);
                                    handleAddSearchHistory(user.userId);
                                }}
                            >
                                친구 삭제
                            </button>
                        ) : (
                            <SignalButton
                                onClickSignal={() => {
                                    handleSendSignal(user.userId);
                                    handleAddSearchHistory(user.userId);
                                }}
                            />
                        )}
                        <button
                            className={s.deleteFriendsButton}
                            onClick={() => setShowDeleteFriendButton(!showDeleteFriendButton)}
                        >
                            <img src={deleteFriendsButton} alt='deleteFriendsButton' />
                        </button>
                    </div>
                );
            case "SENT":
                return (
                    <button
                        className={s.withdrawRequestButton}
                        onClick={() => {
                            handleDeleteRequest(user.userId, "REQUEST");
                            showPopup("WITHDRAW");
                            handleAddSearchHistory(user.userId);
                        }}
                    >
                        요청 취소
                    </button>
                );
            case "RECEIVED":
                return (
                    <div className={s.buttonContainer}>
                        <button
                            className={s.acceptRequestButton}
                            onClick={() => {
                                handleAcceptRequest(user.userId);
                                handleAddSearchHistory(user.userId);
                            }}
                        >
                            수락
                        </button>
                        <button
                            className={s.refuseRequestButton}
                            onClick={() => {
                                handleRejectRequest(user.userId);
                                showPopup("REFUSE");
                                handleAddSearchHistory(user.userId);
                            }}
                        >
                            거절
                        </button>
                    </div>
                );
            case "JUSTHUMAN":
            default:
                return (
                    <button
                        className={s.sendRequestButton}
                        onClick={() => {
                            handleSendRequestFriend(user.userId);
                            showPopup("SEND");
                            handleAddSearchHistory(user.userId);
                        }}
                    >
                        친구 요청
                    </button>
                );
        }
    };

    return (
        <div className={s.userContainer}>
            <div className={s.profileSection}>
                <div className={s.profileImageContainer}>
                    <img src={user.profile} alt={`${user.userName}'s profile`} className={s.profileImage} />
                </div>
                <div className={s.userInfo}>
                    <p className={s.userName}>{user.userName}</p>
                    <p className={s.userId}>@{user.userId}</p>
                </div>
            </div>

            {/* 버튼 UI */}
            {renderButton()}

            {/* ✅ 팝업 (개별 유저마다 표시) */}
            {popupType && (
                <div className={`${s.popup} ${popupType ? s[`popup${popupType}`] : ""}`}>
                    <span className={s.popupTitle}>
                        {popupType === "REFUSE" && "친구 요청을 거절했어요"}
                        {popupType === "WITHDRAW" && "친구 요청을 취소했어요"}
                        {popupType === "SEND" && "친구 요청을 완료했어요!"}
                    </span>
                    {popupType === "SEND" && <span className={s.popupText}>요청 중인 친구에서 확인할 수 있어요</span>}
                </div>
            )}

            {/* 친구 삭제 모달 */}
            {isDeleteFriendModalOpen && (
                <DeleteFriendModal
                    username={user.userName}
                    userId={user.userId}
                    profile={user.profile}
                    onClose={() => {
                        setIsDeleteFriendModalOpen(false);
                    }}
                    onDelete={() => {
                        handleDeleteRequest(user.userId, "FRIEND");
                    }}
                />
            )}
        </div>
    );
};

export default ShowSearchedUser;