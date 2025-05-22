import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileDto, ProfileService } from "../services/profile.service";
import {getRefreshToken} from "../auth/cookiesService.ts";
import {fetchAvatarById} from "../pages/administration/AdminItemUserPage.tsx";
import defaultAvatar from "../assets/jpg/default_avatar.jpg";

interface ProfileContextType {
    profile: ProfileDto | null;
    avatarUrl: string;
}

const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    avatarUrl: defaultAvatar,
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    useEffect(() => {
        const hasRefreshToken = getRefreshToken();
        if (!hasRefreshToken) return;

        const fetchProfile = async () => {
            try {
                const { data } = await ProfileService.getProfile();
                setProfile(data);

                if (!data.avatar?.id) {
                    setAvatarUrl(defaultAvatar);
                    return;
                }

                const url = await fetchAvatarById(data.avatar.id)
                setAvatarUrl(url || defaultAvatar);

                return () => {
                    if (url) URL.revokeObjectURL(url);
                };
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
                setAvatarUrl(defaultAvatar);
            }
        };

        fetchProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, avatarUrl }}>
            {children}
        </ProfileContext.Provider>
    );
};