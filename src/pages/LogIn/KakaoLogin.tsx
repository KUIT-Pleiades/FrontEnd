import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogInRequest } from "../../functions/logInRequest";
import { useAuth } from "../../store/authStore";
import LogInPending from "./LogInPending";
import { axiosRequest } from "../../functions/axiosRequest";
import { Message, UserInfo } from "../../interfaces/Interfaces";
import { isMessage } from "../../functions/isMessage";
import { useCharacterStore } from "../../store/useCharacterStore";

export default function KakaoLogin() {
  const navigate = useNavigate();
  const url = useLocation();
  const { authorization, setToken } = useAuth();
  const { updateUserInfo } = useCharacterStore();
  const urlParams = new URLSearchParams(url.search);
  const hash = urlParams.get("hash");

  useEffect(() => {
    if (!hash) {
      navigate("/loginfail");
      return;
    }
    const handleLogin = async () => {
      const tokenData = await kakaoLogInRequest(hash);
      if (tokenData === null) {
        navigate("/loginfail");
        return;
      }
      setToken(tokenData.accessToken);
    };

    handleLogin();
  }, [hash, navigate, setToken, updateUserInfo, url.search]);

  useEffect(() => {
    if (authorization) {
      const getUser = async () => {
        try {
          const userData = await axiosRequest<UserInfo | Message>(
            "/home",
            "GET",
            null
          );

          // 응답 상태 코드 확인 (선택사항)
          console.log("응답 상태 코드:", userData.status);

          if (isMessage(userData.data)) {
            console.log(userData.data.message);
            navigate("/onboarding");
          } else {
            updateUserInfo(userData.data);
            navigate("/home");
          }
        } catch (error) {
          console.error("사용자 정보 요청 오류:", error);
          navigate("/loginfail"); // 오류 발생 시 로그인 실패 페이지로 이동
        }
      };
      getUser();
    }
  }, [authorization, navigate, updateUserInfo]);

  return <LogInPending />;
}
