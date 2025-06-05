import styles from "./styles/ProfilePage.module.css";
import {useTranslation} from "react-i18next";
import {ProfileTabs} from "../components/profile/ProfileTabs.tsx";
import {useProfile} from "../context/ProfileContext.tsx";
import {ContactTypes, Gender, ProfileService} from "../services/profile.service.ts";
import {useState} from "react";
import {FileService} from "../services/file.service.ts";
import {AvatarCropModal} from "../components/profile/AvatarCropModal.tsx";

export const ProfilePage = () => {
    const {t} = useTranslation('common');
    const { profile, avatarUrl } = useProfile();
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

    if (!profile) return <div>Загрузка...</div>;

    return (
        <div className={styles.profile_page}>
            <h1 className={styles.title}>{t("profile.profile")}</h1>
            <div className={styles.profile_container}>
                <div className={styles.left_menu}>
                    <h2 className={`${styles.title_name} ${styles.mobile_only}`}>
                        {profile.lastName} {profile.firstName} {profile.patronymic}
                    </h2>
                    <label>
                        {avatarUrl && (
                            <img src={avatarUrl} alt="avatar" className={styles.avatar} style={{cursor: 'pointer'}}/>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden/>
                    </label>
                    {selectedImage && (
                        <AvatarCropModal
                            imageSrc={selectedImage}
                            onClose={() => setSelectedImage(null)}
                            onCropComplete={handleCroppedImage}
                        />
                    )}


                    <div className={styles.section}>
                        <p className={styles.section_header_text}>{t("profile.personal_data")}</p>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.gender")}:</p>
                            <p className={styles.section_base_text}>{profile.gender == Gender.Female ? "Женский" : profile.gender == Gender.Male ? "Мужской" : "Не определен"}</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.birthday")}:</p>
                            <p className={styles.section_base_text}>{profile.birthDate}</p>
                        </div>

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.citizenship")}:</p>
                            <p className={styles.section_base_text}>
                                {profile.citizenship ? profile.citizenship.name : "-"}
                            </p>
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

                        {profile.contacts?.map((contact, index) => (
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

                        <div className={styles.section_item_block}>
                            <p className={styles.section_name_text}>{t("profile.address")}:</p>
                            <p className={styles.section_base_text}>{profile.address ? profile.address : '-'}</p>
                        </div>

                        <div className={styles.section_item_block}></div>
                    </div>
                </div>

                <div className={styles.main_info}>
                    <h2 className={`${styles.title_name} ${styles.desktop_only}`}>
                        {profile.lastName} {profile.firstName} {profile.patronymic}
                    </h2>

                    {profile && (profile.userTypes?.length ? (
                        <ProfileTabs userTypes={profile.userTypes}/>
                    ) : (
                        <p></p>
                    ))}

                </div>
            </div>
        </div>
    );
};