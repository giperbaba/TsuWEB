import {UsefulServiceCategory, UsefulServiceDto} from "../../services/useful_services.service.ts";
import styles from "../../pages/administration/styles/AdminUsersPage.module.css"
import {fetchFileById} from "../../pages/administration/AdminItemUserPage.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import EditService from "../../assets/icons/EditService.tsx";
import DeleteService from "../../assets/icons/DeleteService.tsx";
import OpenService from "../../assets/icons/OpenService.tsx";
import CloseService from "../../assets/icons/CloseService.tsx";
import defaultAvatar from "../../assets/jpg/default_avatar.jpg";

interface ServiceCardProps {
    service: UsefulServiceDto;
    onDelete: (serviceId: string) => Promise<void>;
    onEdit: (service: UsefulServiceDto) => void;
}

export const ServiceCard = (props: ServiceCardProps) => {
    const { t } = useTranslation('common');
    const [pictureUrl, setPictureUrl] = useState<string | undefined>();
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <div className={styles.item_service}>
            <div className={styles.service_image}>
                <img src={pictureUrl} alt="picture" className={styles.service_image}/>
            </div>

            <div className={styles.section_container}>
                <p className={styles.title_service}>{props.service.title}</p>
                <div className={styles.section_row}>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("services.link")}</div>
                        <div className={styles.section_base_text}>{props.service.link}</div>
                    </div>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("services.type")}</div>
                        <div
                            className={styles.section_base_text}>{props.service.category == UsefulServiceCategory.ForAll ?
                            "Общий" : props.service.category == UsefulServiceCategory.Students ? "Студент" : "Сотрудник"}</div>
                    </div>
                </div>
                {isOpen ?
                    <div className={styles.sections_hidden}>
                        <div className={styles.section_item_block}>
                            <div className={styles.section_name_text}>{t("services.description")}</div>
                            <div className={styles.section_base_text}>{props.service.description}</div>
                        </div>
                        <div className={styles.section_item_block}>
                            <div className={styles.section_name_text}>{t("services.condition")}</div>
                            <div className={styles.section_base_text}>{props.service.termsOfDisctribution}</div>
                        </div>
                        <CloseService style={{alignSelf: "center"}} onClick={() => setIsOpen(!isOpen)}></CloseService>
                    </div> : <OpenService style={{alignSelf: "center"}} onClick={() => setIsOpen(!isOpen)}></OpenService>
                }
            </div>

            <div className={styles.service_buttons}>
                <EditService
                    onClick={() => props.onEdit(props.service)}
                    style={{ cursor: "pointer" }}
                />

                <DeleteService onClick={() => props.onDelete(props.service.id)} style={{cursor: "pointer"}}></DeleteService>
            </div>
        </div>
    )
}