import React, { useEffect, useState } from 'react';
import { Character } from '../../interfaces/Interfaces';
import s from './FriendsTab.module.scss';

// components
import SearchBarInFriendsTab from './SearchBarInFriendsTab/SearchBarInFriendsTab';
import ShowFriendRequestsList from './ShowFriendRequestsList/ShowFriendRequestsList';
import ShowMyFriendsList from './ShowMyFriendsList/ShowMyFriendsList';
import ShowMyRequestsList from './ShowMyRequestsList/ShowMyRequestsList';
import SortCriteriaBox from './SortCriteriaBox/SortCriteriaBox';

// image files
import hideUpArrow from '../../assets/FriendsTab/hideUpArrow.svg';
import showDownArrow from '../../assets/FriendsTab/showDownArrow.svg';
import pleiadesLogo from '../../assets/FriendsTab/pleiadesLogoNoFriends.png';

interface Friend {
    Id: string;
    Name: string;
}

interface FriendsData {
    FriendRequests: Friend[];
    MyFriends: Friend[];
    MyRequests: Friend[];
}

const FriendsTab: React.FC = () => {
    const [character, setCharacter] = useState<Character | null>(null);
    const [friendsData, setFriendsData] = useState<FriendsData | null>(null);

    //목록 접기 / 열기
    const [isShowFriendRequests, setIsShowFriendRequests] = useState<boolean>(true);
    const [isShowMyFriends, setIsShowMyFriends] = useState<boolean>(true);
    const [isShowMyRequests, setIsShowMyRequests] = useState<boolean>(true);
    //친구 있는지 없는지
    const [hasNoFriend, setHasNoFriend] = useState<boolean>(false);

    const [sortCriteria, setSortCriteria] = useState<"최신순" | "이름순">("최신순");

    const handleDeleteFriend = () => {
        //친구 삭제
    }

    useEffect(() => {
        fetch("/src/mock/character1.json")
            .then((res) => res.json())
            .then((data) => {setCharacter(data)})
            .catch((err) => {console.error(err)});
        fetch("/src/mock/socialInfo.json")
            .then((res) => res.json())
            .then((data) => {setFriendsData(data)})
            .catch((err) => {console.error(err)});
    }, []);
    useEffect(() => {
        if (
            friendsData?.FriendRequests?.length === 0 &&
            friendsData?.MyFriends?.length === 0 &&
            friendsData?.MyRequests?.length === 0
        ) {
            setHasNoFriend(true); // 친구 없음
            setIsShowFriendRequests(false);
            setIsShowMyFriends(false);
            setIsShowMyRequests(false);
        } else {
            setHasNoFriend(false); // 친구 있음
        }
    }, [friendsData]);

    if (!character || !friendsData) return <div>Loading...</div>;

    return (
        <div className={s.container}>
            {/*================================ 제목 부분 ===================================*/}
            <div className={s.headContainer}>
                <div className={s.title}>
                    <span className={s.titleName}>{character?.characterName}</span>
                    <span className={s.titleWelcome}>님의 친구목록</span>
                </div>
            </div>
            {/*================================ 검색창 부분 ==================================*/}
            <SearchBarInFriendsTab />
            {/*================================ 친구 목록 부분 ================================*/}
            <div className={s.friendsList}>
                {/*============= 받은 친구 요청 리스트 =============*/}
                <div className={s.friendRequests}>
                    <div className={s.friendRequestsHead}>
                        <button className={s.showHideButton} onClick={() => setIsShowFriendRequests(!isShowFriendRequests)}>
                            {isShowFriendRequests ? 
                                <img src={hideUpArrow} alt="hideUpArrow" />
                            :
                                <img src={showDownArrow} alt="showDown" />
                            }
                        </button>
                        <span>친구 요청 왔어요 ({friendsData?.FriendRequests?.length || 0})</span>
                    </div>
                    {friendsData?.FriendRequests ?
                        (
                            <div className={s.friendRequestsSection}>
                                {isShowFriendRequests && friendsData.FriendRequests.map((friend) => (
                                    <div key={friend.Id} className={s.friendRequest}>
                                        <ShowFriendRequestsList otherUser={friend} />
                                    </div>
                                ))}
                            </div>
                        )
                    :
                        (<div className={s.friendRequestsSection}></div>)
                    }
                </div>
                {/*============= 내 친구 리스트 =============*/}
                <div className={s.myFriends}>
                    <div className={s.myFriendsHead}>
                        <button className={s.showHideButton} onClick={() => setIsShowMyFriends(!isShowMyFriends)}>
                            {isShowMyFriends ? 
                                <img src={hideUpArrow} alt="hideUpArrow" />
                            :
                                <img src={showDownArrow} alt="showDown" />
                            }
                        </button>
                        <span>내 친구 ({friendsData?.MyFriends?.length || 0})</span>
                    </div>

                    {friendsData?.MyFriends ?
                        (
                            <>
                                {isShowMyFriends &&
                                        <div className={s.sortCriteriaBoxContainer}>
                                            <SortCriteriaBox sortCriteria={sortCriteria} setSortCriteria={setSortCriteria}/>
                                        </div>
                                }
                                
                                <div className={s.myFriendsSection}>
                                    {isShowMyFriends && friendsData.MyFriends.map((friend) => (
                                        <div key={friend.Id} className={s.myFriend}>
                                            <ShowMyFriendsList otherUser={friend} handleDeleteFriend={handleDeleteFriend} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    :
                        (<div className={s.myFriendsSection}></div>)
                    }
                </div>
                {/*============= 내가 친구요청 보낸 리스트 =============*/}
                <div className={s.myRequests}>
                    <div className={s.myRequestsHead}>
                        <button className={s.showHideButton} onClick={() => setIsShowMyRequests(!isShowMyRequests)}>
                            {isShowMyRequests ? 
                                <img src={hideUpArrow} alt="hideUpArrow" />
                            :
                                <img src={showDownArrow} alt="showDown" />
                            }
                        </button>
                        <span>요청 중인 친구 ({friendsData?.MyRequests?.length || 0})</span>
                    </div>
                    {friendsData?.MyRequests ?
                        (
                            <div className={s.myRequestsSection}>
                                {isShowMyRequests && friendsData.MyRequests.map((friend) => (
                                    <div key={friend.Id} className={s.myRequest}>
                                        <ShowMyRequestsList otherUser={friend} />
                                    </div>
                                ))}
                            </div>
                        )
                    :
                        (<div className={s.myRequestsSection}></div>)
                    }
                </div>
            </div>

            {/*================================ 친구가 없을 때 ================================*/}
            {hasNoFriend &&
                <div className={s.noFriend}>
                    <p className={s.noFriendFirstText}>아직 친구가 없어요...</p>
                    <p className={s.noFriendSecondText}>ID를 검색해 친구를 추가해 보세요!</p>
                    <img src={pleiadesLogo} alt="pleiadesLogo" width={176} />
                </div>
            }
            
        </div>
    )
}

export default FriendsTab
