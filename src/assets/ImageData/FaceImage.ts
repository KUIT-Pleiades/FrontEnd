//const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

// 타입 정의: tags 속성은 이제 필요 없습니다.
export interface FaceItem {
  name: string;
  src: string;
}

// // 각 파츠별로 이미지 URL 객체를 생성합니다.
// // (아이템 개수는 실제 보유한 파일에 맞게 수정해주세요)
// const partURLs: Record<string, Record<string, string>> = {
//   face_skin: {}, // 피부색
//   face_hair: {}, // 머리
//   face_eyes: {}, // 눈
//   face_nose: {}, // 코
//   face_mouth: {}, // 입
//   face_mole: {}, // 점
// };

// // 각 파츠별로 이미지 개수를 설정합니다. (예시)
// const partCounts = {
//   face_skin: 7,
//   face_hair: 23,
//   face_eyes: 19,
//   face_nose: 5, // 예시 개수
//   face_mouth: 10, // 예시 개수
//   face_mole: 3, // 예시 개수
// };

// // 반복문을 통해 각 파츠의 URL을 동적으로 생성합니다.
// for (const [part, count] of Object.entries(partCounts)) {
//   for (let i = 1; i <= count; i++) {
//     const num = i.toString().padStart(2, "0");
//     const fileName = `${part}_${num}.png`; // "face_hair_01.png" 형식의 파일 이름
//     partURLs[part][fileName] = `${IMG_BASE_URL}${fileName}`;
//   }
// }

// // 최종적으로 모든 얼굴 아이템을 담는 FaceImages 배열을 생성합니다.
// export const FaceImages: FaceItem[] = [];
// for (const part in partURLs) {
//   for (const [name, src] of Object.entries(partURLs[part])) {
//     FaceImages.push({ name, src });
//   }
// }

export const FaceImages: FaceItem[] = [
  // 1. 피부색 테스트용 아이템
  {
    name: "face_skin_01.png",
    src: "/face_skin_01.png", // public 폴더의 실제 파일 경로
  },
  // 2. 머리 테스트용 아이템
  {
    name: "face_hair_01.png",
    src: "/face_hair_01.png", // public 폴더의 실제 파일 경로
  },
  // 3. 눈 테스트용 아이템
  {
    name: "face_eyes_01.png",
    src: "/face_eyes_01.png", // public 폴더의 실제 파일 경로
  },
  // 4. 코 테스트용 아이템
  {
    name: "face_nose_01.png",
    src: "/face_nose_01.png", // public 폴더의 실제 파일 경로
  },
  // 5. 입 테스트용 아이템
  {
    name: "face_mouth_01.png",
    src: "/face_mouth_01.png", // public 폴더의 실제 파일 경로
  },
  // 6. 점 테스트용 아이템
  {
    name: "face_mole_01.png",
    src: "/face_mole_01.png", // public 폴더의 실제 파일 경로
  },
];