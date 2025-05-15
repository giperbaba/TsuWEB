import styles from "./styles/ServicesPage.module.css"
import {useTranslation} from "react-i18next";

export const ServicesPage = () => {
    const {t} = useTranslation('common');

    return(
        <div className={styles.services_page}>
            <h1 className={styles.title}>{t("services.services")}</h1>
        </div>
    )
}