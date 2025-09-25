import { axiosRequest } from "../functions/axiosRequest";
import {
  OfficialFaceData,
  OfficialClothData,
  OfficialBackgroundData,
} from "../interfaces/Interfaces";

/**
 * 공식몰 얼굴 아이템 목록과 찜 목록을 가져오는 API 함수
 * @returns Promise<OfficialFaceData>
 */
export const getOfficialFaceItems = async (): Promise<OfficialFaceData> => {
  const response = await axiosRequest<OfficialFaceData>(
    "/store/official/face",
    "GET",
    null
  );
  return response.data;
};

/**
 * 공식몰 의상 아이템 목록과 찜 목록을 가져오는 API 함수
 * @returns Promise<OfficialClothData>
 */
export const getOfficialClothItems = async (): Promise<OfficialClothData> => {
  const response = await axiosRequest<OfficialClothData>(
    "/store/official/cloth",
    "GET",
    null
  );
  return response.data;
};

/**
 * 공식몰 배경 아이템 목록과 찜 목록을 가져오는 API 함수
 * @returns Promise<OfficialBackgroundData>
 */
export const getOfficialBackgroundItems =
  async (): Promise<OfficialBackgroundData> => {
    const response = await axiosRequest<OfficialBackgroundData>(
      "/store/official/bg",
      "GET",
      null
    );
    return response.data;
  };
