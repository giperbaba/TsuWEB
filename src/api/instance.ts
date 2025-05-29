import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken, setRefreshToken } from "../auth/cookiesService.ts";
import {redirectToLogin, redirectToServerError} from "../services/navigationService.ts";

const API_URL = 'https://lk-stud.api.kreosoft.space/api';

const instance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
    },
    paramsSerializer: {
        indexes: null
    }
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

                const isPublicPage = window.location.pathname.startsWith("/events");
                if (!isPublicPage) {
                    redirectToLogin();
                }

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

                const isPublicPage = window.location.pathname.startsWith("/events");
                if (!isPublicPage) {
                    redirectToLogin();
                }

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

export function parseJwt(token: string): any | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}