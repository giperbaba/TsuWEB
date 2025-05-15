import styles from "./styles/CertificatesPage.module.css"
import {useTranslation} from "react-i18next";

export const CertificatesPage = () => {
    const {t} = useTranslation('common');

    return(
        <div className={styles.certificate_page}>
            <h1 className={styles.title}>{t("certificates.certificates")}</h1>
        </div>
    )
}