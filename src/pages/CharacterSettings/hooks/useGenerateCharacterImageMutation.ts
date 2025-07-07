// src/pages/CharacterSettings/hooks/useGenerateCharacterImageMutation.ts
import { useMutation } from "@tanstack/react-query";
import { CharacterImg, UserInfo } from "../../../interfaces/Interfaces";

const IMG_MAKER = import.meta.env.VITE_IMG_MAKER;

export const useGenerateCharacterImageMutation = () => {
  return useMutation<CharacterImg, Error, UserInfo>({
    mutationFn: async (characterData: UserInfo) => {
      const response = await fetch(IMG_MAKER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(characterData),
      });

      if (!response.ok) {
        throw new Error("캐릭터 이미지 생성 실패");
      }

      return await response.json();
    },
  });
};