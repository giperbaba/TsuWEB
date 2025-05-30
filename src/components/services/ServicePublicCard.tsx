import {UsefulServiceDto} from "../../services/useful_services.service.ts";
import styles from "../../pages/administration/styles/AdminUsersPage.module.css"
import {fetchFileById} from "../../pages/administration/AdminItemUserPage.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import defaultAvatar from "../../assets/jpg/default_avatar.jpg";
import LinkUsefulService from "../../assets/icons/LinkUsefulService.tsx";
import {useNotification} from "../../context/NotificationContext.tsx";
import { useMediaQuery } from 'react-responsive';

interface ServicePublicCardProps {
    service: UsefulServiceDto;
}

export const ServicePublicCard = (props: ServicePublicCardProps) => {
    const { t } = useTranslation('common');
    const { notify } = useNotification();

    const [pictureUrl, setPictureUrl] = useState<string | undefined>();

    const isMobile = useMediaQuery({ maxWidth: 600 });

    const handleServiceLinkClick = (link: string) => {
        try {
            const url = new URL(link);

            if (!['http:', 'https:'].includes(url.protocol)) {
                notify('error', t("services.invalid_link_protocol"));
                return;
            }

            window.open(link, '_blank', 'noopener,noreferrer');
        } catch (e) {

            notify('error', t("services.invalid_link"));
        }
    };

    useEffect(() => {
        const fetchImage = async () => {
            if (!props.service || !props.service.id) return;

            if (props.service.logo !== null) {
                const url = await fetchFileById(props.service.logo.id);
                setPictureUrl(url);
            }
            else {
                setPictureUrl(defaultAvatar);
            }

        };
        if (props.service) {
            fetchImage();
        }
    }, []);

    return(
        <div className={styles.item_public_service}>
            {!isMobile ?
                <>
                    <div className={styles.item_public_header}>
                        <p className={styles.title_service}>{props.service.title}</p>

                        <button
                            type="button"
                            className={styles.search_button}
                            onClick={() => handleServiceLinkClick(props.service.link)}
                        >
                            {t("services.link_service")}
                            <LinkUsefulService/>
                        </button>
                    </div>

                    <div className={styles.public_service_main_part}>
                        <div className={styles.service_image}>
                            <img src={pictureUrl} alt="picture" className={styles.service_image}/>
                        </div>

                        <div className={styles.section_container}>

                            <div className={styles.section_item_block}>
                                <div className={styles.section_base_text}>{props.service.description}</div>
                            </div>

                            <div className={styles.section_item_block}>
                                <div className={styles.section_name_text}>{t("services.condition")}</div>
                                <div className={styles.section_base_text}>{props.service.termsOfDisctribution}</div>
                            </div>
                        </div>
                    </div>
                </> :
                <div className={styles.public_service_mobile_container}>
                    <div className={styles.service_public_image}>
                        <img src={pictureUrl} alt="picture" className={styles.service_image}/>
                    </div>

                    <p className={styles.title_service}>{props.service.title}</p>

                    <div className={styles.section_item_block}>
                        <div className={styles.section_base_text}>{props.service.description}</div>
                    </div>

                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("services.condition")}</div>
                        <div className={styles.section_base_text}>{props.service.termsOfDisctribution}</div>
                    </div>

                    <button
                        type="button"
                        className={styles.link_button}
                        onClick={() => handleServiceLinkClick(props.service.link)}
                    >
                        {t("services.link_service")}
                        <LinkUsefulService/>
                    </button>

                </div>

            }

        </div>
    )
}