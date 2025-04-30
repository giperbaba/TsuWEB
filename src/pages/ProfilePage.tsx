import { useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import { ProfileService } from "../services/profile.service";
import {FileService} from "../services/file.service.ts";
import styles from "./styles/ProfilePage.module.css"

export const ProfilePage = () => {
    const { request } = useRequest();

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await request(
                ProfileService.getProfile()
            );
            console.log(await FileService.getAvatar(response.data.avatar.id));
            console.log(await ProfileService.getStudentInfo());
            console.log(response.data);
        };

        fetchProfile()
    }, [request]);

    return(
        <div className={styles.profile_page}>
            <h1>Профиль</h1>
        </div>
    );
};