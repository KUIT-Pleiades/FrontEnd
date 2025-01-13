import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { naverLogInRequest } from "../../functions/logInRequest";
import { LogInState } from "../../types/types";

export default function NaverLogin() {
  const navigate = useNavigate();
  const url = useLocation();
  const urlParams = new URLSearchParams(url.search);
  const authCode = urlParams.get("code");
  const [loginState, setLoginState] = useState<LogInState>("Pending");

  useEffect(() => {
    const handleLogin = async () => {
      if (authCode) {
        const tokenData = await naverLogInRequest(authCode, "Auth");
        window.localStorage.setItem("pleiadesTokenA", tokenData.accessToken);
        window.localStorage.setItem("pleiadesTokenR", tokenData.refreshToken);
        setLoginState("Success");
      } else {
        setLoginState("Fail");
        navigate("/login");
      }
    };

    handleLogin();
  }, [authCode, navigate]);
  return <div>{loginState}</div>;
}
