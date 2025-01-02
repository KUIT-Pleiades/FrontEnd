import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import Splash from "./pages/SplashScreen/Splash";
// import LogIn from "./pages/LogInPage/LogInPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
