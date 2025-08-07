import { useState, useEffect } from 'react';
import s from './SubCategoryTabs.module.scss';
import { CategoryType } from '../OfficialUsedStore';
import searchBtn from "../../../../assets/btnImg/blackSearchBtn.svg";
import searchBtnGray from "../../../../assets/btnImg/searchBtn.svg";
import closeBtn from '../../../../assets/btnImg/closeBtn.svg';

interface SubCategoryTabsProps {
  activeCategory: CategoryType;
}

const SUB_CATEGORIES: Record<CategoryType, string[]> = {
  face: ['전체', '머리', '눈', '코', '입', '점'],
  cloth: ['전체', '상의', '하의', '세트', '신발', '악세서리'],
  background: ['전체', '별', '우주정거장'],
};

export default function SubCategoryTabs({ activeCategory }: SubCategoryTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState('전체');
  const [isSearching, setIsSearching] = useState(false);
  const tabs = SUB_CATEGORIES[activeCategory];

  useEffect(() => {
    setActiveSubTab('전체');
    setIsSearching(false);
  }, [activeCategory]);

  if (!tabs) {
    return null;
  }

  const handleSearchClick = () => {
    setIsSearching(!isSearching);
  };

  return (
    <div className={s.container}>
      {isSearching ? (
        <div className={s.searchContainer}>
          <img src={searchBtnGray} alt="search icon" className={s.searchIcon} />
          <input
            type="text"
            placeholder="아이템, 키워드를 검색해보세요"
            className={s.searchInput}
          />
        </div>
      ) : (
        <div className={s.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${s.tab} ${activeSubTab === tab ? s.active : ""}`}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      <button className={s.searchButton} onClick={handleSearchClick}>
        <img src={isSearching ? closeBtn : searchBtn} alt="search" />
      </button>
    </div>
  );
}
