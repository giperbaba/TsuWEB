import styles from "./styles/EventCard.module.css"
import {fetchFileById} from "../../pages/administration/AdminItemUserPage.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import EditService from "../../assets/icons/EditService.tsx";
import DeleteService from "../../assets/icons/DeleteService.tsx";
import defaultAvatar from "../../assets/jpg/default_avatar.jpg";
import {EventAuditory, EventFormat, EventShortDto, EventStatus, EventType} from "../../services/event.service.ts";

interface EventCardProps {
    event: EventShortDto
    onDelete: (eventId: string) => Promise<void>;
    onEdit: (event: EventShortDto) => void;
}

export const EventCard = (props: EventCardProps) => {
    const { t } = useTranslation('common');
    const [pictureUrl, setPictureUrl] = useState<string | undefined>();

    useEffect(() => {
        const fetchImage = async () => {
            if (!props.event || !props.event.id) return;

            if (props.event.picture !== null) {
                const url = await fetchFileById(props.event.picture.id);
                setPictureUrl(url);
            }
            else {
                setPictureUrl(defaultAvatar);
            }

        };
        if (props.event) {
            fetchImage();
        }
    }, []);

    return(
        <div className={styles.item_event}>
            <div className={styles.event_image}>
                <img src={pictureUrl} alt="picture" className={styles.event_image}/>
            </div>

            <div className={styles.section_container}>
            <p className={styles.title_event}>{props.event.title}</p>

                <div  className={`${styles.menu_item} ${styles[props.event.status.toLowerCase()]}`}>{props.event.status == EventStatus.Archive ? "Архив" :
                    props.event.status == EventStatus.Draft ? "Черновик" : props.event.status == EventStatus.Actual ? "Активное" : "В процессе"}</div>

                <div className={styles.section_row}>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("events.type")}</div>
                        <div className={styles.section_base_text}>{props.event.type == EventType.Open ? "Открытое" : props.event.type == EventType.Close ? "Закрытое" : "Неизвестно" }</div>
                    </div>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("events.auditory")}</div>
                        <div
                            className={styles.section_base_text}>{props.event.auditory == EventAuditory.All ?
                            "Общий" : props.event.auditory == EventAuditory.Students ? "Студенты" : "Преподаватели"}</div>
                    </div>
                </div>

                <div className={styles.section_row}>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("events.date")}</div>
                        <div
                            className={styles.section_base_text}>{props.event.dateTimeTo ? formatDate(props.event.dateTimeFrom) +
                            " - " + formatDate(props.event.dateTimeTo) : formatDate(props.event.dateTimeFrom)}</div>
                    </div>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("events.format")}</div>
                        <div
                            className={styles.section_base_text}>{props.event.format == EventFormat.Online ?
                            "Онлайн" : "Офлайн"}</div>
                    </div>
                </div>

                <div className={styles.section_row}>
                    {props.event.dateTimeFrom ? <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("events.start_time")}</div>
                        <div
                            className={styles.section_base_text}>{formatTime(props.event.dateTimeFrom)}</div>
                    </div> : <></>}
                    {props.event.dateTimeTo ? <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t("events.end_time")}</div>
                        <div className={styles.section_base_text}>{formatTime(props.event.dateTimeTo)}</div>
                    </div> : <></>}
                </div>
            </div>

            <div className={styles.event_buttons}>
                <EditService
                    onClick={() => props.onEdit(props.event)}
                    style={{cursor: "pointer"}}
                />

                <DeleteService onClick={() => props.onDelete(props.event.id)}
                               style={{cursor: "pointer"}}></DeleteService>
            </div>
        </div>
    )
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("ru-RU"); // формат: дд.мм.гггг
};

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ru-RU", {
        hour: '2-digit',
        minute: '2-digit',
    });
};
