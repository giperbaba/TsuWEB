import axios from 'axios'
//import { getAccessToken } from "../auth/";

const API_URL = 'https://lk-stud.api.kreosoft.space/api';

export const instance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
    },
})

//request interceptor
/*instance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    ( err ) => { Promise.reject(err) },
)

//response interceptor*/
