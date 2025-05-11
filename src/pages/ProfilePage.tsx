import {useEffect, useState} from "react";
import {ContactTypes, ProfileDto, ProfileService} from "../services/profile.service";
import {FileService} from "../services/file.service";
import styles from "./styles/ProfilePage.module.css";
import {useTranslation} from "react-i18next";
import {ProfileTabs} from "../components/profile/ProfileTabs.tsx";

export const ProfilePage = () => {
    const {t} = useTranslation('common');
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await ProfileService.getProfile();
                setProfile(data);
                console.log(data);

                if (!data.avatar?.id) {
                    setAvatarUrl('/default-avatar.png');
                    return;
                }

                try {
                    const avatar = await FileService.getAvatar(data.avatar.id);

                    let blob;
                    if (avatar.data instanceof Blob) {
                        blob = avatar.data;
                    }
                    else if (avatar.data instanceof ArrayBuffer) {
                        blob = new Blob([avatar.data], { type: 'image/jpeg' });
                    }
                    else if (typeof avatar.data === "string") {
                        const bytes = new Uint8Array(avatar.data.length);
                        for (let i = 0; i < avatar.data.length; i++) {
                            bytes[i] = avatar.data.charCodeAt(i);
                        }
                        blob = new Blob([bytes], { type: 'image/jpeg' });
                    } else {
                        console.warn("Неизвестный формат данных для аватара");
                        setAvatarUrl('../assets/png/default-avatar.png');
                        return;
                    }

                    const url = URL.createObjectURL(blob);
                    setAvatarUrl(url);
                }
                catch (avatarError) {
                    console.error('Ошибка загрузки аватара:', avatarError);
                    setAvatarUrl('/default-avatar.png');
                }
            } catch (profileError) {
                console.error('Ошибка загрузки профиля:', profileError);
            }
        };

        fetchProfile();

        return () => {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, []);

    if (!profile) return <div>Загрузка...</div>;

    return (
        <div className={styles.profile_page}>
            <h1 className={styles.title}>{t("profile.profile")}</h1>
            <div className={styles.profile_container}>
                <div className={styles.left_menu}>
                    <img src={avatarUrl} alt="avatar" className={styles.avatar} />
                    <div className={styles.section}>
                        <p className={styles.section_header_text}>{t("profile.personal_data")}</p>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.gender")}:</p>
                            <p className={styles.section_base_text}>{profile.gender}</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.birthday")}:</p>
                            <p className={styles.section_base_text}>{profile.birthDate}</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.citizenship")}:</p>
                            <p className={styles.section_base_text}>{profile.citizenship.name}</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.snils")}:</p>
                            <p className={styles.section_base_text}>-</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.email")}:</p>
                            <p className={styles.section_base_text}>{profile.email}</p>
                        </div>

                    </div>

                    <div className={styles.section}>
                        <p className={styles.section_header_text}>{t("profile.contacts")}</p>

                        {profile.contacts?.map((contact) => (
                            <div className={styles.section_item_block}>
                                <p className={styles.section_name_text}>{contact.type == ContactTypes.Phone ? t("profile.phone")
                                    : contact.type == ContactTypes.Email ? t("profile.additional_email")
                                        : contact.type == ContactTypes.SocialMedia ? t("profile.social_media"): t("profile.add_info")}:</p>
                                <p className={styles.section_base_text}>{contact.value}</p>
                            </div>
                        ))}

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.address")}:</p>
                            <p className={styles.section_base_text}>{profile.address}</p>
                        </div>

                        <div className={styles.section_item_block}></div>
                    </div>
                </div>

                <div className={styles.main_info}>
                    <h2 className={styles.title_name}>{profile.lastName} {profile.firstName} {profile.patronymic}</h2>

                    {profile && <ProfileTabs userTypes={profile.userTypes}/>}

                </div>
            </div>
        </div>
    );
};