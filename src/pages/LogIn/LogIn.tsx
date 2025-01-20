import s from "./LogIn.module.scss";
import pleiadesLogo from "../../assets/pleiadesLogo.png";
import kakao from "../../assets/kakao.svg";
import naver from "../../assets/naver.svg";
import {
  kakaoLoginRequest,
  naverLogInRedirect,
  naverLogInRequest,
} from "../../functions/logInRequest";

export default function LogIn() {
  const naverLogIn = () => {
    const naverRefreshToken = window.localStorage.getItem("pleiadesTokenNR");
    if (naverRefreshToken) {
      naverLogInRequest(naverRefreshToken, "Refresh");
    } else {
      window.location.href = naverLogInRedirect();
    }
  };

  const kakaoLogin = () => {
    kakaoLoginRequest();
  };

  return (
    <div className={s.logInPageContainer}>
      <div className={s.content}>
        <img
          className={s.logo}
          src={pleiadesLogo}
          width={89.76}
          height={64.58}
          alt="Logo"
        />
        <p className={s.subTitle}>플레이아데스, 내 별, 정거장</p>
        <p className={s.title}>플레이아데스</p>
        <button className={s.button} onClick={kakaoLogin}>
          <img className={s.socialLogo} src={kakao} alt="kakao" />
          <div className={s.buttonDescription}>카카오로 시작하기</div>
        </button>
        <button className={s.button} onClick={naverLogIn}>
          <img className={s.socialLogo} src={naver} alt="naver" />
          <div className={s.buttonDescription}>NAVER로 시작하기</div>
        </button>
      </div>
    </div>
  );
}
