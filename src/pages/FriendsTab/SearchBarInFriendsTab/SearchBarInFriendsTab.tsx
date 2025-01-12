import React from 'react';
import s from './SearchBarInFriendsTab.module.scss';

// image files
import searchIcon from '../../../assets/FriendsTab/searchIcon.svg';

const SearchBarInFriendsTab: React.FC = () => {
    return (
        <div className={s.searchBarContainer}>
            <div className={s.searchBar}>
                <input
                    className={s.searchInput}
                    type="text"
                    placeholder="추가할 ID를 검색해보세요"
                />
                <button
                    className={s.searchButton}
                    type="submit"
                >
                    <img src={searchIcon} alt="searchIcon" />
                </button>
            </div>
        </div>
        
    )
}

export default SearchBarInFriendsTab;
