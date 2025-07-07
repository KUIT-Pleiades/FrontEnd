// 얼굴 탭의 세부 카테고리 정의 (id는 파일명의 prefix와 일치시킵니다)
export const FACE_TABS = [
  { id: 'all', name: '전체' },
  { id: 'face_skin', name: '피부색' },
  { id: 'face_hair', name: '머리' },
  { id: 'face_eyes', name: '눈' },
  { id: 'face_nose', name: '코' },
  { id: 'face_mouth', name: '입' },
  { id: 'face_mole', name: '점' },
];

// 패션 탭의 세부 카테고리 정의 (id는 파일명의 prefix와 일치시킵니다)
export const FASHION_TABS = [
  { id: 'all', name: '전체' },
  { id: 'fashion_top', name: '상의' },
  { id: 'fashion_bottom', name: '하의' },
  { id: 'fashion_set', name: '세트' },
  { id: 'fashion_shoes', name: '신발' },
  { id: 'fashion_acc', name: '악세서리' }, // 모든 악세서리는 fashion_acc로 시작
];

/**
 * 이미지 파일 이름에서 카테고리(prefix)를 추출하는 함수입니다.
 * 새로운 파일명 규칙을 완벽하게 지원하도록 수정되었습니다.
 * 예: "fashion_acc_head_01.png" -> "fashion_acc_head"
 */
export const getCategoryFromFileName = (fileName: string): string => {
  // ".png"와 같은 확장자를 제거합니다.
  const nameWithoutExtension = fileName.split('.')[0];
  // 마지막 숫자 부분을 제거합니다. (예: "face_hair_02" -> "face_hair")
  const category = nameWithoutExtension.replace(/_\d+$/, '');
  return category;
};

/**
 * 파일 이름에서 대표 카테고리(face, outfit, item)를 반환하는 함수입니다.
 * Zustand 스토어를 업데이트할 때 사용됩니다.
 */
export const getMainCategory = (fileName: string) => {
  if (fileName.startsWith("face_")) return "face";

  // [수정] 더 구체적인 'fashion_acc_'를 먼저 확인하도록 순서를 변경합니다.
  if (fileName.startsWith("fashion_acc_")) return "item";

  if (fileName.startsWith("fashion_")) return "outfit";

  return "unknown";
};
/**
 * 파일 이름에서 세부 파츠(skinColor, hair, top 등)를 반환하는 함수입니다.
 * Zustand 스토어를 업데이트할 때 사용됩니다.
 */
export const getPartName = (fileName: string): string => {
  const category = getCategoryFromFileName(fileName); // 예: "face_skin", "fashion_acc_head"

  // 파일 카테고리에 맞는 정확한 UserInfo 키를 반환하도록 매핑합니다.
  switch (category) {
    // 얼굴
    case "face_skin":
      return "skinColor"; // "skin"이 아닌 "skinColor"
    case "face_hair":
      return "hair";
    case "face_eyes":
      return "eyes";
    case "face_nose":
      return "nose";
    case "face_mouth":
      return "mouth";
    case "face_mole":
      return "mole";
    // 의상
    case "fashion_top":
      return "top";
    case "fashion_bottom":
      return "bottom";
    case "fashion_set":
      return "set";
    case "fashion_shoes":
      return "shoes";
    // 악세서리
    case "fashion_acc_head":
      return "head";
    case "fashion_acc_eyes":
      return "eyes_item";
    case "fashion_acc_ears":
      return "ears";
    case "fashion_acc_neck":
      return "neck";
    case "fashion_acc_leftWrist":
      return "leftWrist";
    case "fashion_acc_rightWrist":
      return "rightWrist";
    case "fashion_acc_leftHand":
      return "leftHand";
    case "fashion_acc_rightHand":
      return "rightHand";
    // 일치하는 것이 없으면 빈 문자열 반환
    default:
      return "";
  }
};