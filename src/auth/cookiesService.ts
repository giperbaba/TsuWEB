import Cookies from 'js-cookie'

export const getAccessToken = () => Cookies.get('accessToken');

export const getRefreshToken = () => Cookies.get('refreshToken');

export const setAccessToken = (token: string) =>
    Cookies.set('accessToken', token, { secure: true, sameSite: 'Strict' });

export const setRefreshToken = (token: string) =>
    Cookies.set('refreshToken', token, { secure: true, sameSite: 'Strict' });

export const removeAccessToken = () => Cookies.remove('accessToken');

export const removeRefreshToken = () => Cookies.remove('refreshToken');