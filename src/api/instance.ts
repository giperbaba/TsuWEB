import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken, setRefreshToken } from "../auth/cookiesService.ts";
import {redirectToLogin, redirectToServerError} from "../services/navigationService.ts";

const API_URL = 'https://lk-stud.api.kreosoft.space/api';

const instance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
    },
});

// request interceptor
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshPromise: Promise<RefreshResponse> | null = null;

// response interceptor
instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const currentRefreshToken = getRefreshToken();
            if (!currentRefreshToken) {
                removeAccessToken();
                removeRefreshToken();
                redirectToLogin();
                return Promise.reject(error);
            }

            try {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = refreshTokens(currentRefreshToken);
                }

                const { accessToken, refreshToken } = await refreshPromise!;
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);

                isRefreshing = false;
                refreshPromise = null;

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                refreshPromise = null;

                removeAccessToken();
                removeRefreshToken();
                redirectToLogin();
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 500) {
            redirectToServerError();
        }

        return Promise.reject(error);
    }
);
export default instance;

interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export async function refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    const rawAxios = axios.create(); // отдельный инстанс без интерсепторов
    const response = await rawAxios.post<RefreshResponse>(
        `${API_URL}/Auth/refresh`,
        { refreshToken },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return response.data;
}