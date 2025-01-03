import React, { useEffect, useState } from 'react';
import { Character } from '../../../interfaces/Interfaces';
import s from './FriendsTab.module.scss';

import ShowFriendRequestsList from './ShowFriendRequestsList/ShowFriendRequestsList';
import ShowMyFriendsList from './ShowMyFriendsList/ShowMyFriendsList';
import ShowMyRequestsList from './ShowMyRequestsList/ShowMyRequestsList';

import searchIcon from '../../../assets/searchIcon.svg';
import hideUpArrow from '../../../assets/hideUpArrow.svg';
import showDownArrow from '../../../assets/showDownArrow.svg';
import pleiadesLogo from '../../../assets/pleiadesLogo.png';
import sortShowDown from '../../../assets/sortShowDown.svg'
import sortHideUp from '../../../assets/sortHideUp.svg'

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

    const [isShowFriendRequests, setIsShowFriendRequests] = useState<boolean>(true);
    const [isShowMyFriends, setIsShowMyFriends] = useState<boolean>(true);
    const [isShowMyRequests, setIsShowMyRequests] = useState<boolean>(true);

    const [hasNoFriend, setHasNoFriend] = useState<boolean>(false);

    const [sortCriteria, setSortCriteria] = useState<"최신순" | "이름순">("최신순"); // true: 이름순 정렬, false: 최신순 정렬
    const [isSelectSortPopupOpen, setIsSelectSortPopupOpen] = useState<boolean>(false);
    
    /* 검색 기능들
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    };
    */

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

    if (!character || !friendsData) return <div>Loading...</div>;

    if (friendsData.FriendRequests.length === 0 && friendsData.MyFriends.length === 0 && friendsData.MyRequests.length === 0) {
        setHasNoFriend(true);
    }

    return (
        <div className={s.container}>

            {/*================================ 제목 부분 ================================*/}
            <div className={s.title}>
                <span className={s.titleName}>{character?.characterName}</span>
                <span className={s.titleWelcome}>님 어서오세요!</span>
            </div>
            {/*================================ 검색창 부분 ================================*/}
            <div className={s.searchBar}>
                <input
                    className={s.searchInput}
                    type="text"
                    placeholder="추가할 ID를 검색해보세요"
                    // value={searchQuery}
                    // onChange={handleSearchChange}
                />
                <button
                    className={s.searchButton}
                    // onClick={handleSearchSubmit}
                    type="submit"
                >
                    <img src={searchIcon} alt="searchIcon" />
                </button>
            </div>
            {/*================================ 친구 목록 부분 ================================*/}
            <div className={s.friendsList}>
                {/*============= 받은 친구 요청 리스트 =============*/}
                <div className={s.friendRequests}>
                    <div className={s.friendRequestsHead}>
                        <span>친구 요청 왔어요 ({friendsData?.FriendRequests.length})</span>
                        <button className={s.showHideButton} onClick={() => setIsShowFriendRequests(!isShowFriendRequests)}>
                            {isShowFriendRequests ? 
                                <img src={hideUpArrow} alt="hideUpArrow" />
                            :
                                <img src={showDownArrow} alt="showDown" />
                            }
                        </button>
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
                        <span>내 친구 ({friendsData?.MyFriends.length})</span>
                        <button className={s.showHideButton} onClick={() => setIsShowMyFriends(!isShowMyFriends)}>
                            {isShowMyFriends ? 
                                <img src={hideUpArrow} alt="hideUpArrow" />
                            :
                                <img src={showDownArrow} alt="showDown" />
                            }
                        </button>
                    </div>
                    <div className={s.sortBySection}>
                        
                    </div>
                    {friendsData?.MyFriends ?
                        (
                            <>
                                {isShowMyFriends &&
                                        (isSelectSortPopupOpen ?
                                            (
                                                <div className={s.sortBySectionOpen}>
                                                    <div className={s.sortCriteriaSelectButtonContainer}>
                                                        <button onClick={() => {
                                                                setSortCriteria("최신순");
                                                                setIsSelectSortPopupOpen(false);}}
                                                                className={s.sortCriteriaSelectButton}
                                                                {...(sortCriteria === "이름순" ? {style: {color: "#E1E1E1"}} : {})}
                                                        >최신순</button>

                                                        <button onClick={() => {
                                                                setSortCriteria("이름순");
                                                                setIsSelectSortPopupOpen(false);}}
                                                                className={s.sortCriteriaSelectButton}
                                                                {...(sortCriteria === "최신순" ? {style: {color: "#E1E1E1"}} : {})}
                                                        >이름순</button>
                                                    </div>
                                                    <img
                                                        onClick={() => setIsSelectSortPopupOpen(false)}
                                                        src={sortHideUp}
                                                        alt='sortHideUp'
                                                    />
                                                </div>
                                            )
                                            :
                                            (
                                                <div className={s.sortBySectionClose} onClick={() => setIsSelectSortPopupOpen(true)}>
                                                    {sortCriteria}
                                                    <img src={sortShowDown} alt='sortShowDown' />
                                                </div>
                                            )
                                        )
                                }
                                <div className={s.myFriendsSection}>
                                {isShowMyFriends && <div style={{height:"10px"}}></div>}
                                    {isShowMyFriends && friendsData.MyFriends.map((friend) => (
                                        <div key={friend.Id} className={s.myFriend}>
                                            <ShowMyFriendsList otherUser={friend} />
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
                        <span>요청 중인 친구 ({friendsData?.MyRequests.length})</span>
                        <button className={s.showHideButton} onClick={() => setIsShowMyRequests(!isShowMyRequests)}>
                            {isShowMyRequests ? 
                                <img src={hideUpArrow} alt="hideUpArrow" />
                            :
                                <img src={showDownArrow} alt="showDown" />
                            }
                        </button>
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
                    <p>아직 친구가 없어요...</p>
                    <p>ID를 검색해 친구를 추가해 보세요!</p>
                    <img src={pleiadesLogo} alt="pleiadesLogo" />
                </div>
            }
            
        </div>
    )
}

export default FriendsTab
