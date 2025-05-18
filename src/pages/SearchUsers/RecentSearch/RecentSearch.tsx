// pages/SearchUsers/components/RecentSearch.tsx
import React from 'react';
import s from './RecentSearch.module.scss';

// components
import ShowRecentSearchUsers from './ShowRecentSearchUser/ShowRecentSearchUser';
import { RecentSearchedUser } from '../../../interfaces/Interfaces';

interface RecentSearchProps {
    onUserClick: (id: string) => void;
    onRemove: (id: string) => void;
    recentSearches: RecentSearchedUser[] | undefined;
}

const RecentSearch: React.FC<RecentSearchProps> = ({ onUserClick, onRemove, recentSearches }) => {
    return (
        <div className={s.recentSearchContainer}>
            <span className={s.recentSearchTitle}>최근 검색</span>
            <div className={s.separator} />

            {!recentSearches || recentSearches.length === 0 ? (
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
                        onRemove={() => onRemove(user.userId)}
                        onClick={() => onUserClick(user.userId)}
                    />
                ))
            )}
        </div>
    );
};

export default RecentSearch;