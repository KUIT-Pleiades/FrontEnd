import React from 'react';
import s from './RecentSearch.module.scss';
//import recentResearchHistory from '../../../mock/recentSearchUsers.json';

// components
import ShowRecentSearchUsers from './ShowRecentSearchUser/ShowRecentSearchUser';
import { fetchRequest } from '../../../functions/fetchRequest';
import { RecentSearchedUser } from '../../../interfaces/Interfaces';

interface RecentSearchProps {
    onUserClick: (id: string) => void;
    getRecentSearches: () => void;
    recentSearches: RecentSearchedUser[];
}

const RecentSearch: React.FC<RecentSearchProps> = ({ onUserClick, getRecentSearches, recentSearches }) => {

    const handleRemoveRecentSearch = async (searchedId: string) => {
        try {
            const response = await fetchRequest<{ message: string }>(
                `/users/histories/${searchedId}`,
                "DELETE",
                null
            );
    
            if (!response) {
                console.log("삭제 성공. 삭제된 아이디: ",searchedId);
                // 삭제 성공 시, 최신 검색 목록을 다시 불러옴
                getRecentSearches();
            } else {
                console.error("최근 검색 기록 삭제 실패");
            }
        } catch (error) {
            console.error("최근 검색 기록 삭제 중 오류 발생:", error);
        }
    };

    return (
        <div className={s.recentSearchContainer}>
            <span className={s.recentSearchTitle}>최근 검색</span>
            <div className={s.separator} />
            {recentSearches.length === 0 ? (
                <div className={s.noRecentSearchContainer}>
                    <span className={s.noRecentSearch}>검색 내역이 없어요</span>
                </div>
            ) : (
                recentSearches.map(user => (
                    <ShowRecentSearchUsers
                        key={user.userId}
                        id={user.userId}
                        name={user.userName}
                        profileImage={user.profile}
                        onRemove={() => handleRemoveRecentSearch(user.userId)}
                        onClick={() => onUserClick(user.userId)}
                    />
                ))
            )}
        </div>
    )
}

export default RecentSearch;
