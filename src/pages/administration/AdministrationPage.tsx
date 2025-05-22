import styles from "./styles/AdministrationPage.module.css";
import { useTranslation } from "react-i18next";
import Users from "../../assets/icons/Users.tsx";
import Events from "../../assets/icons/Events.tsx";
import LinkIcon from "../../assets/icons/LinkIcon.tsx";
import {Link, useNavigate} from "react-router-dom";

export const AdministrationPage = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    const cards = [
        {
            title: t("administration.users"),
            description: t("administration.cardDescription"),
            icon: Users,
            path: "/admin/users",
        },
        {
            title: t("administration.services"),
            description: t("administration.cardDescription"),
            icon: LinkIcon,
            path: "/admin/usefulservices",
        },
        {
            title: t("administration.events"),
            description: t("administration.cardDescription"),
            icon: Events,
            path: "/admin/events",
        },
    ];

    return (
        <div className={styles.admin_page}>
            <h1 className={styles.title}>{t("administration.administration")}</h1>
                <div className={styles.breadcrumb}>
                    <Link to="/profile" className={styles.breadcrumb_link}>
                        {t("common.main")}
                    </Link>
                    <span className={styles.breadcrumb_separator}> / </span>
                    <Link to="/admin" className={styles.breadcrumb_active}>
                        {t("administration.administration")}
                    </Link>
                </div>


            <div className={styles.cards}>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={styles.card}
                        onClick={() => navigate(card.path)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') navigate(card.path);
                        }}
                    >
                        <div className={styles.card_header}>
                            <span className={styles.card_icon}><card.icon></card.icon></span>
                            <span className={styles.card_title}>{card.title}</span>
                        </div>
                        <p className={styles.card_description}>{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};