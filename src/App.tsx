// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import s from "./app.module.scss";
// import Settings from "./pages/Settings/Settings";
import FriendsTab from "./pages/Home/FriendsTab/FriendsTab";

function App() {
  // const [count, setCount] = useState(0);
  // const [showMain, setShowMain] = useState(true);

  // const handleClick = () => {
  //   setShowMain(false);
  // };

  return (
    <>
      {/* {showMain ? (
        <>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          <p className={s.pTag}>Pretendard 적용 됐는지 글씨체 확인 바람</p>
          <button onClick={handleClick}>Settings 보기</button>
        </>
      ) : (
        <Settings />
      )} */}
      <FriendsTab />
    </>
  );
}

export default App;
