import styles from "./styles/EventsPage.module.css"
import {useTranslation} from "react-i18next";

export const EventsPage = () => {
    const {t} = useTranslation('common');

    return(
        <div className={styles.events_page}>
            <h1 className={styles.title}>{t("events.events")}</h1>
        </div>
    )
}