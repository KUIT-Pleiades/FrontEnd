import s from "./ThemeCategoryTabs.module.scss";
import heartIcon from "../../../../assets/Icon/heart.svg";
import filledHeartIcon from "../../../../assets/Icon/filledHeart.svg";
import searchBtn from "../../../../assets/btnImg/blackSearchBtn.svg";
//import closeBtn from "../../../../assets/btnImg/closeBtn.svg";

interface ThemeCategoryTabsProps {
  reverseSearch: () => void;
  activeTheme: string;
  onThemeChange: (theme: string) => void;
  isFocus: boolean; // isFocus prop 추가
  setFocus: () => void; // setFocus prop 추가
}

const THEME_CATEGORIES = [
  "좋아요",
  "추천",
  "여름",
  "데일리",
  "K-POP",
  "겨울",
  "심플",
  "러블리",
  "봄",
  "포인트",
];

export default function ThemeCategoryTabs({
  reverseSearch,
  activeTheme,
  onThemeChange,
  isFocus,
}: ThemeCategoryTabsProps) {
  return (
    !isFocus && (
      <div className={s.container}>
        <div className={s.themeContainer}>
          {THEME_CATEGORIES.map((theme) => (
            <button
              key={theme}
              className={`${s.themeTab} ${
                activeTheme === theme ? s.active : ""
              }`}
              onClick={() => onThemeChange(theme)}
            >
              {theme === "좋아요" ? (
                <img
                  className={s.themeIcon}
                  src={activeTheme === "좋아요" ? filledHeartIcon : heartIcon}
                  alt="좋아요"
                />
              ) : (
                theme
              )}
            </button>
          ))}
        </div>
        <button className={s.searchButton} onClick={reverseSearch}>
          <img src={searchBtn} alt="search" />
        </button>
      </div>
    )
  );
}
