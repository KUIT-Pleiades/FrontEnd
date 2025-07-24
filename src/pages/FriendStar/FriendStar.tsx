import s from "./FriendStar.module.scss";
import pleiadeslogo from "../../assets/bottomBarImg/starIconSelected.svg";
import diary from "../../assets/home/diary.svg";
import { getImage } from "../../functions/getImage";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { axiosRequest } from "../../functions/axiosRequest";
import { User } from "../../interfaces/Interfaces";
import Pending from "../PageManagement/Pending";
import { loadImage } from "../../functions/loadImage";
import backBtn from "../../assets/btnImg/whiteBackBtn.png";


export default function FriendStar() {
	const navigate = useNavigate();
  const location = useLocation();
  const userId: string = location.state?.userId;

  const [userData, setUserData] = useState<User>();
  const [loadCompleted, setLoadCompleted] = useState(0);
  const [background, setBackground] = useState<string>(
    getImage("background_01")
  );

  const increaseLoad = useCallback(() => {
    setLoadCompleted((prev) => prev + 1);
  }, []);

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

  useEffect(() => {
    if (userData) {
      const starBg = getImage(userData.starBackground);
      setBackground(starBg);
      loadImage(userData.character, increaseLoad);
      loadImage(starBg, increaseLoad);
    }
  }, [userData, increaseLoad]);

  return (
    <div className={s.container}>
      {loadCompleted < 2 && <Pending />}
      <img className={s.background} src={background} alt="background" />
      <div className={s.dim} />
      <div className={s.title}>
        <button className={s.backButton} onClick={() => navigate(-1)}>
          <img src={backBtn} alt="backArrow" />
        </button>
        <img className={s.planet} src={pleiadeslogo} alt="star" />
        <p className={s.owner}>{userData ? userData.userName : ""}님의 별</p>
      </div>
      {userData && (
        <img className={s.character} src={userData.character} alt="캐릭터" />
      )}
      <img
        className={s.diary}
        src={diary}
        alt="일기장"
        onClick={() =>
          navigate("/friendreport", {
            state: { userId, userName: userData?.userName },
          })
        }
      />
    </div>
  );
}
