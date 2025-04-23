import Cookies from 'js-cookie'

export const getAccessToken = () => Cookies.get('accessToken');

export const setAccessToken = (token) =>
    Cookies.set('accessToken', token, { secure: true, sameSite: 'Strict' });

export const removeAccessToken = () => Cookies.remove('accessToken');