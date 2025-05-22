import styles from "./styles/AdminUsersPage.module.css"
import {Link, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {ContactTypes, Gender, ProfileDto, ProfileService} from "../../services/profile.service.ts";
import {FileService} from "../../services/file.service.ts";
import {UserService} from "../../services/user.service.ts";
import {AvatarCropModal} from "../../components/profile/AvatarCropModal.tsx";
import defaultAvatar from "../../assets/jpg/default_avatar.jpg";


export const AdminItemUserPage = () => {
    const { t } = useTranslation('common');
    const { userId } = useParams<{ userId: string }>();
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCroppedImage = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'avatar.jpg');

        const { data } = await FileService.upload(formData);
        await ProfileService.updateAvatar(data.id);
        window.location.reload();
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!userId) {
                    console.error("User ID is missing");
                    return;
                }

                const { data } = await UserService.getItemUser(userId);
                setProfile(data);

                if (!data.avatar?.id) {
                    setAvatarUrl(defaultAvatar);
                    return;
                }

                const url = await fetchAvatarById(data.avatar.id);
                setAvatarUrl(url);

                return () => {
                    if (url) URL.revokeObjectURL(url);
                };
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
                setAvatarUrl(defaultAvatar);
            }
        };

        fetchProfile();
    }, [userId]);

    return(
        <div className={styles.item_user_page}>
            <h1 className={styles.title}>{t("administration.administration")}</h1>

            <div className={styles.breadcrumb}>
                <Link to="/profile" className={styles.breadcrumb_link}>
                    {t("common.main")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/admin" className={styles.breadcrumb_link}>
                    {t("administration.administration")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/admin/users" className={styles.breadcrumb_link}>
                    {t("administration.users")}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
                <Link to="/admin/users" className={styles.breadcrumb_active}>
                    <p>{profile?.firstName} {profile?.lastName} {profile?.patronymic}</p>
                </Link>
            </div>

            <h2 className={`${styles.title_name}`}>
                {profile?.lastName} {profile?.firstName} {profile?.patronymic}
            </h2>

            <div className={styles.main_data_container}>
                <div>
                    <label>
                        <img src={avatarUrl} alt="avatar" className={styles.image} style={{cursor: 'pointer'}}/>
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden/>
                    </label>
                    {selectedImage && (
                        <AvatarCropModal
                            imageSrc={selectedImage}
                            onClose={() => setSelectedImage(null)}
                            onCropComplete={handleCroppedImage}
                        />
                    )}
                </div>

                <div className={styles.left_data_container}>
                    <div className={styles.section}>
                        <p className={styles.section_header_text}>{t("administration.data")}</p>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.gender")}:</p>
                            <p className={styles.section_base_text}>{profile?.gender == Gender.Female ? "Женский" : profile?.gender == Gender.Male ? "Мужской" : "Не определен"}</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.birthday")}:</p>
                            <p className={styles.section_base_text}>{profile?.birthDate}</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.email")}:</p>
                            <p className={styles.section_base_text}>{profile?.email}</p>
                        </div>

                    </div>

                    <div className={styles.section}>
                        <p className={styles.section_header_text}>{t("profile.contacts")}</p>

                        {profile?.contacts?.map((contact, index) => (
                            <div key={index} className={styles.section_item_block}>
                                <p className={styles.section_name_text}>
                                    {contact.type === ContactTypes.Phone
                                        ? t("profile.phone")
                                        : contact.type === ContactTypes.Email
                                            ? t("profile.additional_email")
                                            : contact.type === ContactTypes.SocialMedia
                                                ? t("profile.social_media")
                                                : t("profile.add_info")}:
                                </p>
                                <p className={styles.section_base_text}>{contact.value}</p>
                            </div>
                        ))}

                        <div className={styles.section_item_block}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function fetchAvatarById(avatarId: string): Promise<string> {
    try {
        const response = await FileService.getAvatar(avatarId)
        const avatarUrl = URL.createObjectURL(response.data);
        return avatarUrl;
    } catch (error) {
        console.error('Ошибка при получении аватара', error);
        throw error;
    }
}