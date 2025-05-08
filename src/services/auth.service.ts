import instance from "../api/instance.ts";

export interface LoginDto {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResultDto {
    accessToken: string;
    refreshToken: string;
    loginSucceeded: boolean;
}

export const AuthService = {
    login: (params: LoginDto) => instance.post("/Auth/login", params),
}
