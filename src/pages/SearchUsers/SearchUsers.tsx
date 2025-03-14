// SearchUsers.tsx
import React, { useState } from 'react';
import s from './SearchUsers.module.scss';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance'; // axiosInstance import
// components
import SearchUsersBar from '../../components/SearchUsersBar/SearchUsersBar';
import RecentSearch from './RecentSearch/RecentSearch';
import SearchResults from './SearchResults/SearchResults';
import Pending from '../PageManagement/Pending';
import { RecentSearchedUser, SocialUser } from '../../interfaces/Interfaces';

// API 호출 함수들
const fetchSearchResults = async (query: string) => {
  const response = await axiosInstance.get<{ users: SocialUser[] }>(`/users?user_id=${query}`);
  return response.data;
};

const fetchRecentSearches = async () => {
  const response = await axiosInstance.get<{ users: RecentSearchedUser[] }>("/users/histories");
  return response.data;
};

const SearchUsers: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showRecentSearches, setShowRecentSearches] = useState(true);

  // 검색 결과용 useQuery (수동 실행)
  const {
    data: searchData,
    refetch: refetchSearch,
    isLoading: searchLoading,
  } = useQuery<{ users: SocialUser[] }>({
    queryKey: ['searchUsers', searchValue],
    queryFn: () => fetchSearchResults(searchValue),
    enabled: false
  });

  // 최근 검색 기록용 useQuery (showRecentSearches가 true일 때 실행)
  const {
    data: recentData,
    isLoading: recentLoading,
    refetch: refetchRecent,
  } = useQuery<{ users: RecentSearchedUser[] }>({
    queryKey: ['recentSearches'],
    queryFn: fetchRecentSearches,
    enabled: showRecentSearches
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value === '') {
      // 검색어가 비어있으면 검색 결과를 초기화하고 최근 검색 기록 보여주기
      setShowRecentSearches(true);
    }
  };

  const handleSearchSubmit = async (value?: string) => {
    const query = value || searchValue.trim();
    if (!query) return;

    setShowRecentSearches(false);
    await refetchSearch();
  };

  const handleRecentSearchClick = (id: string) => {
    setSearchValue(id);
    setShowRecentSearches(false);
    refetchSearch();
  };

  return (
    <div className={s.container}>
      {(recentLoading || searchLoading) && <Pending />}
      {/*================================ 제목 부분 ===================================*/}
      <div className={s.headContainer}>
        <div className={s.searchSection}>
          <div className={s.searchBarContainer}>
            <SearchUsersBar
              value={searchValue}
              onChange={handleInputChange}
              onSubmit={handleSearchSubmit}
            />
          </div>
          <button
            className={s.cancelSearchButton}
            onClick={() => navigate("/friendtab")}
          >
            취소
          </button>
        </div>
      </div>
      {/*============================== 최근 검색 기록 ================================*/}
      {showRecentSearches && recentData && (
        <div className={s.recentSearchContainer}>
          <RecentSearch
            onUserClick={handleRecentSearchClick}
            getRecentSearches={refetchRecent}
            recentSearches={recentData.users}
          />
        </div>
      )}
      {/*================================ 검색 결과 ================================*/}
      {searchData && searchData.users.length > 0 ? (
        <div className={s.searchResultsContainer}>
          <SearchResults
            filteredUsers={searchData.users}
            refreshSearch={handleSearchSubmit}
          />
        </div>
      ) : !searchLoading && !showRecentSearches ? (
        <div className={s.noResultModal}>
          <span className={s.noResultModalFirstText}>
            검색한 ID가 존재하지 않아요!
          </span>
          <span className={s.noResultModalSecondText}>
            ID를 다시 확인해주세요
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default SearchUsers;