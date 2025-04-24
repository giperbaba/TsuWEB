import axios from 'axios'
import {
    getAccessToken,
    getRefreshToken,
    removeAccessToken, removeRefreshToken,
    setAccessToken,
    setRefreshToken
} from "../auth/cookiesService.ts";
import {redirectToLogin, redirectToServerError} from "../services/navigationService.ts";

const API_URL = 'https://lk-stud.api.kreosoft.space/api';


export const instance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
    },
})

//request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    ( error ) => { Promise.reject(error) },
)

//response interceptor
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config;

        if (error.response?.status === 401 && !request._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        request.headers.Authorization = `Bearer ${token}`;
                        return axios(request);
                    })
                    .catch((error) => Promise.reject(error));
            }
            request._retry = true;
            isRefreshing = true;

            const token = getRefreshToken();

            if (!token) {
                removeAccessToken();
                redirectToLogin();
                return Promise.reject(error);
            }

            try {
                const response = await instance.post(`/Auth/refresh`, {
                    token
                });

                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                processQueue(null, newAccessToken);

                request.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(request);
            } catch (error) {
                processQueue(error);
                removeAccessToken()
                removeRefreshToken()
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        else if (error.response?.status === 500) {
            redirectToServerError();
        }
    }
)