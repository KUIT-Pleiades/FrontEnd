//const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

export interface FashionItem {
  name: string;
  src: string;
}

// // 모든 '패션' 관련 파츠의 URL을 담을 객체
// const partURLs: Record<string, Record<string, string>> = {
//   // 의상
//   fashion_top: {},
//   fashion_bottom: {},
//   fashion_set: {},
//   fashion_shoes: {},
//   // 악세서리 (아이템)
//   fashion_acc_head: {},
//   fashion_acc_eyes_item: {},
//   fashion_acc_ears: {},
//   fashion_acc_neck: {},
//   fashion_acc_leftWrist: {},
//   fashion_acc_rightWrist: {},
//   fashion_acc_leftHand: {},
//   fashion_acc_rightHand: {},
// };

// // 각 파츠별 실제 파일 개수를 설정합니다. (★★★★★ 중요: 실제 파일 개수에 맞게 수정!)
// const partCounts = {
//   // 의상
//   fashion_top: 10,
//   fashion_bottom: 5,
//   fashion_set: 3,
//   fashion_shoes: 5,
//   // 악세서리 (아이템)
//   fashion_acc_head: 2,
//   fashion_acc_eyes_item: 1,
//   fashion_acc_ears: 2,
//   fashion_acc_neck: 1,
//   fashion_acc_leftWrist: 1,
//   fashion_acc_rightWrist: 1,
//   fashion_acc_leftHand: 1,
//   fashion_acc_rightHand: 1,
// };

// // 반복문을 통해 모든 패션 아이템의 URL을 동적으로 생성
// for (const [part, count] of Object.entries(partCounts)) {
//   for (let i = 1; i <= count; i++) {
//     const num = i.toString().padStart(2, "0");
//     const fileName = `${part}_${num}.png`;
//     partURLs[part][fileName] = `${IMG_BASE_URL}${fileName}`;
//   }
// }

// // 최종적으로 모든 패션 아이템을 담는 하나의 배열을 생성합니다.
// export const FashionImages: FashionItem[] = [];
// for (const part in partURLs) {
//   for (const [name, src] of Object.entries(partURLs[part])) {
//     FashionImages.push({ name, src });
//   }
// }

export const FashionImages: FashionItem[] = [
  // --- 의상 테스트용 ---
  {
    name: "fashion_top_01.png",
    src: "/fashion_top_01.png",
  },
  {
    name: "fashion_bottom_01.png",
    src: "/fashion_bottom_01.png",
  },
  {
    name: "fashion_set_01.png",
    src: "/fashion_set_01.png",
  },
  {
    name: "fashion_shoes_01.png",
    src: "/fashion_shoes_01.png",
  },

  // --- 악세서리 테스트용 ---
  {
    name: "fashion_acc_head_01.png",
    src: "/fashion_acc_head_01.png",
  },
  {
    name: "fashion_acc_eyes_01.png",
    src: "/fashion_acc_eyes_01.png",
  },
  {
    name: "fashion_acc_ears_01.png",
    src: "/fashion_acc_ears_01.png",
  },
  {
    name: "fashion_acc_neck_01.png",
    src: "/fashion_acc_neck_01.png",
  },
  {
    name: "fashion_acc_leftWrist_01.png",
    src: "/fashion_acc_leftWrist_01.png",
  },
  {
    name: "fashion_acc_rightWrist_01.png",
    src: "/fashion_acc_rightWrist_01.png",
  },
  {
    name: "fashion_acc_leftHand_01.png",
    src: "/fashion_acc_leftHand_01.png",
  },
  {
    name: "fashion_acc_rightHand_01.png",
    src: "/fashion_acc_rightHand_01.png",
  },
];