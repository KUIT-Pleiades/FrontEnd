/** Auth Token interface */
export interface AuthToken {
  accessToken: string;
}

export interface Message {
  message: string;
}

/** Interfaces For User & Character */

/** 캐릭터 설정이 끝난 후 서버에 전송할 때, 캐릭터 값 서버에서 받아올 때 사용 */
export interface Character {
  userId: string;
  userName: string;
  birthDate: string;
  starBackground: string;
  face: {
    skinColor: string;
    hair: string;
    expression: string;
  };
  outfit: {
    top: string;
    bottom: string;
    shoes: string;
  };
  item: {
    head: string;
    eyes: string;
    ears: string;
    neck: string;
    leftWrist: string;
    rightWrist: string;
    leftHand: string;
    rightHand: string;
  };
}

export interface CharacterImg {
  userId: string;
  profile: string;
  character: string;
}

/** 유저정보표시 */
export interface User {
  userId: string;
  userName: string;
  birthDate: string;
  starBackground: string;
  character: string;
  profile: string;
}

// export interface UserInfo {
//   userId: string;
//   userName: string;
//   birthDate: string;
//   starBackground: string;
//   character: string;
//   profile: string;
//   face: {
//     skinColor: string;
//     hair: string;
//     expression: string;
//   };
//   outfit: {
//     top: string;
//     bottom: string;
//     shoes: string;
//   };
//   item: {
//     head: string;
//     eyes: string;
//     ears: string;
//     neck: string;
//     leftWrist: string;
//     rightWrist: string;
//     leftHand: string;
//     rightHand: string;
//   };
// }

/** [수정] 캐릭터와 유저 정보를 통합한 새로운 인터페이스 */
export interface UserInfo {
  userId: string;
  userName: string;
  birthDate: string;
  starBackground: string;
  character: string;
  profile: string;

  face: {
    skinColor: string; // 피부색
    hair: string; // 머리
    eyes: string; // 눈
    nose: string; // 코
    mouth: string; // 입
    mole: string; // 점
  };

  outfit: {
    top: string; // 상의
    bottom: string; // 하의
    set: string; // 세트
    shoes: string; // 신발
  };

  item: {
    head: string; // 머리에 착용하는 아이템
    eyes_item: string; // 눈에 착용하는 아이템
    ears: string; // 귀에 착용하는 아이템
    neck: string; // 목에 착용하는 아이템
    leftWrist: string; // 왼쪽 손목에 착용하는 아이템
    rightWrist: string; // 오른쪽 손목에 착용하는 아이템
    leftHand: string; // 왼쪽 손에 착용하는 아이템
    rightHand: string; // 오른쪽 손에 착용하는 아이템
  };
}

/** 캐릭터 선택화면에서 선택가능한 아이템 목록 받아올 때 사용*/
export interface AvailableItems {
  faces: {
    skinColors: [
      {
        name: string; // white, yellow...
        imgurl: string; // 이미지 주소
      }
    ];
    hairs: [
      {
        name: string; // 머리 스타일, ex) 포니테일
        imgurl: string; // 이미지 주소
      }
    ];
    expressions: [
      {
        name: string; // 표정(눈, 코, 입)
        imgurl: string;
      }
    ];
  };
  outfits: {
    tops: [
      {
        name: string; // 상의
        imgurl: string;
      }
    ];
    bottoms: [
      {
        name: string; // 하의
        imgurl: string;
      }
    ];
    shoes: [
      {
        name: string; // 신발
        imgurl: string;
      }
    ];
  };
  accessories: [
    {
      name: string; // 악세서리
      imgurl: string;
    }
  ];
  backgrounds: [
    {
      name: string; // 배경
      imgurl: string;
    }
  ];
}

/** 리팩토링을 위한 새로운 UserInfo 인터페이스 */
export interface NewUserInfo {
  userId: string;
  userName: string;
  birthDate: string;
  starBackground: string;
  character: string;
  profile: string;

  face: {
    skinColor: string;
    hair: string;
    eyes: string;
    nose: string;
    mouth: string;
    mole: string;
  };

  outfit: {
    top: string;
    bottom: string;
    set: string;
    shoes: string;
  };

  item: {
    head: string;
    eyes_item: string;
    ears: string;
    neck: string;
    leftWrist: string;
    rightWrist: string;
    leftHand: string;
    rightHand: string;
  };
}

export interface AvailableStationBackground {
  name: string;
  theme: string;
  imgurl: string;
}

export interface AvailableStationBackgrounds {
  backgrounds: AvailableStationBackground[];
}

/** Interfaces For Question */

export interface Question {
  questionID: string;
  question: string;
}

export interface QuestionList {
  questions: Question[];
}

export interface TodayReport {
  question: Question;
  sequence: number;
}

export interface ShowReportOfUser {
  question: Question;
  answer: string;
  respondentId: string;
  isFriend: boolean;
}

export interface Answer {
  answer: string;
}

/** Interfaces For Station */

// interface Position {
//   x: number; // 퍼센트
//   y: number;
// }

export interface Station {
  stationId: string;
  name: string;
  numOfUsers: number;
  stationBackground: string;
  createdAt: string;
  lastActive: string;
  favorite: boolean;
}

export interface Stations {
  stations: Station[];
}

export type SortOptionForStations =
  | "새로운 활동순"
  | "최근 가입순"
  | "오래된 가입순"
  | "이름순";

export interface StationMember {
  userId: string;
  userName: string;
  character: string;
  profile: string;
  positionX: number;
  positionY: number;
  todayReport: boolean;
}

export interface StationDetails {
  stationId: string;
  adminUserId: string;
  name: string;
  intro: string;
  numberOfUsers: number;
  createdAt: string;
  stationBackground: string;
  reportNoticeTime: string;
  reportWritten: boolean;
  stationMembers: StationMember[];
}

/** Interfaces For Social */

export interface OtherUser {
  friendId: number;
  userId: string;
  userName: string;
  profile: string;
}

export interface Social {
  received: OtherUser[];
  friend: OtherUser[];
  sent: OtherUser[];
}

/** Interfaces For Signal */
export interface SignalFrom {
  userId: string;
  userName: string;
  imageIndex: number;
}

/** Interfaces For Search */
export interface SearchedUser {
  userId: string;
  userName: string;
  profile: string;
  status: "FRIEND" | "RECEIVED" | "SENT" | "JUSTHUMAN";
}

export interface RecentSearchedUser {
  userId: string;
  userName: string;
  profile: string;
}

export interface StationResponse {
  stationId: string;
  name: string;
  stationBackground: string;
  intro?: string;
  numberOfUsers?: number;
  reportNoticeTime?: string;
  createdAt?: string;
}

export interface CreateStationResponse {
  stationId: string;
  message?: string;
}

// Interfaces For Market
// 공식몰에서 판매하는 개별 아이템의 타입
export interface OfficialItem {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  theme: string[];
  created_at: string;
}

// '/store/official/face' API가 응답하는 전체 데이터의 타입
export interface OfficialFaceData {
  items: OfficialItem[];
  wishlist: number[];
}

// '/store/official/cloth' API가 응답하는 전체 데이터의 타입
export interface OfficialClothData {
  items: OfficialItem[];
  wishlist: number[];
}

// '/store/official/background' API가 응답하는 전체 데이터의 타입
export interface OfficialBackgroundData {
  items: OfficialItem[];
  wishlist: number[];
}
