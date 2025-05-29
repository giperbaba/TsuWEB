import styles from "../admin/styles/EventCard.module.css"
import {fetchFileById} from "../../pages/administration/AdminItemUserPage.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import defaultAvatar from "../../assets/jpg/default_avatar.jpg";
import {EventFormat, EventShortDto, EventStatus} from "../../services/event.service.ts";
import {Link} from "react-router-dom";

interface EventPublicCardProps {
    event: EventShortDto,
    isFilter: boolean
}

export const EventPublicCard = (props: EventPublicCardProps) => {
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
            <div className={styles.public_picture_wrapper}>
                <img src={pictureUrl} alt="picture" className={styles.picture}/>
            </div>

            <div className={styles.section_container}>
                <Link to={`/events/${props.event.id}`} key={props.event.id} className={styles.event_link}>
                    <p className={styles.title_event}>{props.event.title}</p>
                </Link>

                {props.isFilter ?
                    <div
                    className={`${styles.menu_item} ${styles[props.event.status.toLowerCase()]}`}>{props.event.status == EventStatus.Archive ? "Архив" :
                    props.event.status == EventStatus.Draft ? "Черновик" : props.event.status == EventStatus.Actual ? "Активное" : "В процессе"}</div>
                : <></>}

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
        </div>
    )
}

export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("ru-RU"); // формат: дд.мм.гггг
};

export const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ru-RU", {
        hour: '2-digit',
        minute: '2-digit',
    });
};
