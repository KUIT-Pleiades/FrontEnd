const IMG_BASE_URL: string = import.meta.env.VITE_PINATA_ENDPOINT;

// 타입 정의
export interface BackgroundItem {
  name: string;
  src: string;
}

// 최종적으로 모든 배경 아이템을 담는 배열
export const BackgroundImages: BackgroundItem[] = [];

// 배경 이미지의 총 개수 (★★★★★ 실제 파일 개수에 맞게 수정!)
const totalBackgrounds = 5;

// 반복문을 통해 모든 배경 아이템의 정보를 동적으로 생성
for (let i = 1; i <= totalBackgrounds; i++) {
  const num = i.toString().padStart(2, "0");
  const fileName = `background_${num}.png`; // "background_01.png" 형식

  BackgroundImages.push({
    name: fileName,
    src: `${IMG_BASE_URL}${fileName}`,
  });
}
