import React, { useEffect, useState } from 'react';
import { Character } from '../../../interfaces/Interfaces';
import s from './FriendsTab.module.scss';
import ShowFriendList from './ShowFriendList/ShowFriendList';


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
                    <img src='./svgs/searchIcon.svg' alt="searchIcon" />
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
                                <img src='./svgs/hideUpArrow.svg' alt="hideUpArrow" />
                            :
                                <img src='./svgs/showDownArrow.svg' alt="showDown" />
                            }
                        </button>
                    </div>
                    {friendsData?.FriendRequests ?
                        (
                            <div className={s.friendRequestsSection}>
                                {isShowFriendRequests && friendsData.FriendRequests.map((friend) => (
                                    <div key={friend.Id} className={s.friendRequest}>
                                        <ShowFriendList otherUser={friend} />
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
                        <span>전체 ({friendsData?.MyFriends.length})</span>
                        <button className={s.showHideButton} onClick={() => setIsShowMyFriends(!isShowMyFriends)}>
                            {isShowMyFriends ? 
                                <img src='./svgs/hideUpArrow.svg' alt="hideUpArrow" />
                            :
                                <img src='./svgs/showDownArrow.svg' alt="showDown" />
                            }
                        </button>
                    </div>
                    {friendsData?.MyFriends ?
                        (
                            <div className={s.myFriendsSection}>
                                {isShowMyFriends && friendsData.MyFriends.map((friend) => (
                                    <div key={friend.Id} className={s.myFriend}>
                                        <ShowFriendList otherUser={friend} />
                                    </div>
                                ))}
                            </div>
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
                                <img src='./svgs/hideUpArrow.svg' alt="hideUpArrow" />
                            :
                                <img src='./svgs/showDownArrow.svg' alt="showDown" />
                            }
                        </button>
                    </div>
                    {friendsData?.MyRequests ?
                        (
                            <div className={s.myRequestsSection}>
                                {isShowMyRequests && friendsData.MyRequests.map((friend) => (
                                    <div key={friend.Id} className={s.myRequest}>
                                        <ShowFriendList otherUser={friend} />
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
            {!hasNoFriend &&
                <div className={s.noFriend}>
                    <p>아직 친구가 없어요...</p>
                    <p>ID를 검색해 친구를 추가해 보세요!</p>
                    <img src='./svgs/pleiadesLogo.svg' alt="pleiadesLogo" />
                </div>
            }
            
        </div>
    )
}

export default FriendsTab
