import { useState } from "react";
import s from "./ThemeCategoryTabs.module.scss";
import heartIcon from "../../../../assets/Icon/heart.svg";
import filledHeartIcon from "../../../../assets/Icon/filledHeart.svg";

const THEME_CATEGORIES = [
  "좋아요",
  "추천",
  "☀️ 여름 ",
  "NEW",
  "HOT",
  "K-POP",
  "데일리",
];

export default function ThemeCategoryTabs() {
  const [activeTheme, setActiveTheme] = useState("추천");

  return (
    <div className={s.themeContainer}>
      {THEME_CATEGORIES.map((theme) => (
        <button
          key={theme}
          className={`${s.themeTab} ${activeTheme === theme ? s.active : ""}`}
          onClick={() => setActiveTheme(theme)}
        >
          {theme === '좋아요' ? (
            <img
              className={s.themeIcon}
              src={activeTheme === '좋아요' ? filledHeartIcon : heartIcon}
              alt="좋아요"
            />
          ) : (
            theme
          )}
        </button>
      ))}
    </div>
  );
}
