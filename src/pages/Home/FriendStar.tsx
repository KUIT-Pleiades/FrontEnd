import s from "./FriendStar.module.scss";
import pleiadeslogo from "../../assets/bottomBarImg/starIconSelected.png";
import diary from "../../assets/home/diary.svg";
import { getImage } from "../../functions/getImage";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../functions/axiosRequest";
import { User } from "../../interfaces/Interfaces";
import Pending from "../PageManagement/Pending";
import { loadImage } from "../../functions/loadImage";

export default function FriendStar() {
  const location = useLocation();
  const userId: string = location.state?.userId;
  const background = getImage("background_01");
  const [userData, setUserData] = useState<User>();
  const [loadCompleted, setLoadCompleted] = useState(0);

  const increaseLoad = () => {
    setLoadCompleted(loadCompleted + 1);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await axiosRequest<User>(`/home/${userId}`, "GET", null);
      if (response !== null) {
        setUserData(response.data);
      } else {
        console.log("unvalid response");
      }
    };
    getUserInfo();
  }, [userId]);

  if (userData !== undefined) {
    loadImage(userData.character, increaseLoad);
    loadImage(userData.starBackground, increaseLoad);
  }

  return (
    <div className={s.container}>
      {loadCompleted !== 2 && <Pending />}
      <img className={s.background} src={background} alt="background" />
      <div className={s.dim} />
      <div className={s.title}>
        <img className={s.planet} src={pleiadeslogo} alt="star" />
        <p className={s.owner}>{userData ? userData.userName : ""}님의 별</p>
      </div>
      {userData ? (
        <img className={s.character} src={userData.character} alt="캐릭터" />
      ) : (
        ""
      )}

      <img className={s.diary} src={diary} alt="일기장" />
    </div>
  );
}
