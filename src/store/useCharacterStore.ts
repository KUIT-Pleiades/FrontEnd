import { create } from "zustand";
import { Character } from "../interfaces/Interfaces";

// import skin_01 from "../assets/Character/face/skin/skin01.png";
// import hair_01 from "../assets/Character/face/hair/hair01.png";
// import face_01 from "../assets/Character/face/face/face01.png";
// import top_01 from "../assets/Character/outfit/top/top01.png";
// import bottom_01 from "../assets/Character/outfit/bottom/bottom01.png";
// import shoes_01 from "../assets/Character/outfit/shoes/shoes01.png";
// import background_01 from "../assets/backgroundImg/starBackroundImg/backgroundImg01.png"


interface CharacterStore {
  character: Character;         // 캐릭터 상태
  updateCharacter: (updates: Partial<Character>) => void; // 캐릭터 업데이트 함수
	resetCharacter: () => void;   // 캐릭터 초기화 함수
}

const initialCharacter: Character = {
  // 초기 캐릭터 상태 -> 디자이너, pm 과 상의
  userId: "",
  username: "",
  birthDate: "",
  backgroundName: "background_01",
  face: {
    skinColor: "skin01",
    hair: "hair01",
    expression: "face01",
  },
  outfit: {
    top: "top01",
    bottom: "bottom01",
    shoes: "shoes01",
  },
  item: {
    head: "",
    eyes: "",
    ears: "",
    neck: "",
    leftWrist: "",
    rightWrist: "",
    leftHand: "",
    rightHand: "",
  },
};

export const useCharacterStore = create<CharacterStore>((set) => ({ // 캐릭터 store 생성
  character: initialCharacter,
  updateCharacter: (updates) =>
    set((state) => ({
      character: { ...state.character, ...updates },
    })),
  resetCharacter: () => set({ character: initialCharacter }),
}));
