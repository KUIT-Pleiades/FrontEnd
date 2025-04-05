import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../../../functions/axiosRequest";
import s from "./PersonalSetting.module.scss";
import goBtn from "../../../assets/btnImg/goBtn.png";
import { useAuth } from "../../../store/authStore";
import { useCharacterStore } from "../../../store/useCharacterStore";

interface UserData {
  userId: string;
  userName: string;
  birthDate: string;
  email: string;
  profile: string;
}

const PersonalSetting: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { clearToken } = useAuth();
  const { resetUserInfo } = useCharacterStore();

  const handleLogout = () => {
    resetUserInfo();
    clearToken();
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosRequest<UserData>(
          "/home/settings/profile",
          "GET",
          null
        );

        if (response) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("사용자 데이터 가져오기 실패:", error);
      }
    };

    getUserData();
  }, []);

  const handleProfileClick = () => {
    navigate("/setting/profile");
  };

  return (
    <div className={s.settingContainer}>
      <div className={s.title}>설정</div>

      <div className={s.menuList}>
        <div className={s.menuItem} onClick={handleProfileClick}>
          <span>프로필</span>
          <img src={goBtn} alt="" />
        </div>

        <div className={s.menuItem}>
          <span>로그인 계정</span>
          <span className={s.accountEmail}>{userData?.email}</span>
          <img src={goBtn} alt="" />
        </div>

        <div className={s.serviceInfo}>
          <span>서비스 정보</span>
        </div>

        <div className={s.infoItem}>
          <span>이용약관</span>
          <img src={goBtn} alt="" />
        </div>

        <div className={s.infoItem}>
          <span>개인정보 처리방침</span>
          <img src={goBtn} alt="" />
        </div>
      </div>

      <div className={s.bottomButtons}>
        <button className={s.logoutBtn} onClick={handleLogout}>
          로그아웃
        </button>
        <span>|</span>
        <button className={s.withdrawBtn}>탈퇴하기</button>
      </div>
    </div>
  );
};

export default PersonalSetting;
