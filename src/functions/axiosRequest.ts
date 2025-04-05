import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AuthToken } from "../interfaces/Interfaces";
import { useAuth } from "../store/authStore";
import { Methods } from "../types/types";

const BASEURL = import.meta.env.VITE_SERVER_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const { authorization } = useAuth.getState();
  if (authorization) {
    config.headers["Authorization"] = `Bearer ${authorization}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 || error.response.status === 428) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { setToken } = useAuth.getState();
        const refreshResponse = await axios.get<AuthToken>(
          `${BASEURL}/auth/refresh`,
          {
            withCredentials: true,
          }
        );
        const newToken = refreshResponse.data.accessToken;
        setToken(newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("refresh 실패");
        return Promise.reject(refreshError);
      }
    }
    if (error.response.status === 403) {
      console.log("재로그인 필요");
    }
    return Promise.reject(error);
  }
);

export const axiosRequest = async <T>(
  requestPoint: string,
  method: Methods,
  body: object | null
): Promise<{ data: T; status: number; message?: string }> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: requestPoint,
      data: body,
    };
    const response = await axiosInstance(config);
    return {
      data: response.data,
      status: response.status,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};