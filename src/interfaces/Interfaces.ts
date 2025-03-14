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

export interface UserInfo {
  userId: string;
  userName: string;
  birthDate: string;
  starBackground: string;
  character: string;
  profile: string;
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
}

export interface Stations {
  stations: Station[];
}

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

export interface FriendsData {
  received: OtherUser[];
  friend: OtherUser[];
  sent: OtherUser[];
}
export interface SignalFrom {
  userId: string;
  userName: string;
  imageIndex: number;
}

/** Interfaces For SearchUsers */

export interface SocialUser {
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