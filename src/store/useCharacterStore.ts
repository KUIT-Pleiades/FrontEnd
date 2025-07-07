import { create } from "zustand";
import { UserInfo } from "../interfaces/Interfaces";

// import skin_01 from "../assets/Character/face/skin/skin01.png";
// import hair_01 from "../assets/Character/face/hair/hair01.png";
// import face_01 from "../assets/Character/face/face/face01.png";
// import top_01 from "../assets/Character/outfit/top/top01.png";
// import bottom_01 from "../assets/Character/outfit/bottom/bottom01.png";
// import shoes_01 from "../assets/Character/outfit/shoes/shoes01.png";
// import background_01 from "../assets/backgroundImg/starBackroundImg/backgroundImg01.png"

interface CharacterStore {
  userInfo: UserInfo; // 캐릭터 상태
  updateUserInfo: (updates: Partial<UserInfo>) => void; // 캐릭터 업데이트 함수
  resetUserInfo: () => void; // 캐릭터 초기화 함수
}

// const initialUserInfo: UserInfo = {
//   // 초기 캐릭터 상태 -> 디자이너, pm 과 상의
//   userId: "",
//   userName: "",
//   birthDate: "",
//   starBackground: "background_01",
//   character:
//     "https://gateway.pinata.cloud/ipfs/QmWC4899NqLPTqMSVFNZS5qzSUvCH1agcCdRzRrFe1um85",
//   profile:
//     "https://gateway.pinata.cloud/ipfs/QmURNcGX98UAecKyEELM39117X7RwQZE8B1dtm56B4vxEJ",
//   face: {
//     skinColor: "skin_01",
//     hair: "hair_01",
//     expression: "face_01",
//   },
//   outfit: {
//     top: "top_01",
//     bottom: "bottom_01",
//     shoes: "shoes_01",
//   },
//   item: {
//     head: "",
//     eyes: "",
//     ears: "",
//     neck: "",
//     leftWrist: "",
//     rightWrist: "",
//     leftHand: "",
//     rightHand: "",
//   },
// };

// [수정] 새로운 UserInfo 구조에 맞게 초기 상태값 변경
const initialUserInfo: UserInfo = {
  userId: "",
  userName: "",
  birthDate: "",
  starBackground: "background_01",
  character:
    "https://gateway.pinata.cloud/ipfs/QmWC4899NqLPTqMSVFNZS5qzSUvCH1agcCdRzRrFe1um85",
  profile:
    "https://gateway.pinata.cloud/ipfs/QmURNcGX98UAecKyEELM39117X7RwQZE8B1dtm56B4vxEJ",
  face: {
    skinColor: "face_skin_01.png",
    hair: "face_hair_01.png",
    eyes: "face_eyes_01.png", // 기본값 추가
    nose: "face_nose_01.png", // 기본값 추가
    mouth: "face_mouth_01.png", // 기본값 추가
    mole: "", // 점은 기본값 없음
  },
  outfit: {
    top: "fashion_top_01.png",
    bottom: "fashion_bottom_01.png",
    set: "", // 세트는 기본값 없음
    shoes: "fashion_shoes_01.png",
  },
  item: {
    head: "",
    eyes_item: "",
    ears: "",
    neck: "",
    leftWrist: "",
    rightWrist: "",
    leftHand: "",
    rightHand: "",
  },
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  // 캐릭터 store 생성
  userInfo: initialUserInfo,
  updateUserInfo: (updates) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...updates },
    })),
  resetUserInfo: () => set({ userInfo: initialUserInfo }),
}));
