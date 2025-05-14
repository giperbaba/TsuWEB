import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileDto, ProfileService } from "../services/profile.service";
import { FileService } from "../services/file.service";
import {getRefreshToken} from "../auth/cookiesService.ts";

interface ProfileContextType {
    profile: ProfileDto | null;
    avatarUrl: string;
}

const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    avatarUrl: "/default-avatar.png",
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");

    useEffect(() => {
        const hasRefreshToken = getRefreshToken();
        if (!hasRefreshToken) return;

        const fetchProfile = async () => {
            try {
                const { data } = await ProfileService.getProfile();
                console.log(data);
                setProfile(data);

                if (!data.avatar?.id) return;

                const avatar = await FileService.getAvatar(data.avatar.id);
                let blob: Blob;

                if (avatar.data instanceof Blob) {
                    blob = avatar.data;
                } else if (avatar.data instanceof ArrayBuffer) {
                    blob = new Blob([avatar.data], { type: 'image/jpeg' });
                } else if (typeof avatar.data === "string") {
                    const bytes = new Uint8Array(avatar.data.length);
                    for (let i = 0; i < avatar.data.length; i++) {
                        bytes[i] = avatar.data.charCodeAt(i);
                    }
                    blob = new Blob([bytes], { type: 'image/jpeg' });
                } else {
                    console.warn("Неизвестный формат данных для аватара");
                    return;
                }

                const url = URL.createObjectURL(blob);
                setAvatarUrl(url);

                return () => {
                    URL.revokeObjectURL(url);
                };
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
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