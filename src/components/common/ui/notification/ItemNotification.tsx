import styles from "./ItemNotification.module.css"
import {Icons} from "../../../../assets/icons";
import {useTranslation} from "react-i18next";

interface NotificationProps {
    type: 'error' | 'info' | 'warning' | 'success' | 'message'
    text: string;
    onClose?: () => void;
}

const typeConfig = {
    error: {
        icon: <Icons.ErrorCircle />,
        labelKey: "notifications.error",
        color: "#FF5757",
        style: 'error'
    },
    warning: {
        icon: <Icons.WarningCircle />,
        labelKey: "notifications.warning",
        color: "#E78400",
        style: 'warning'
    },
    success: {
        icon: <Icons.SuccessCircle />,
        labelKey: "notifications.success",
        color: "#39882C",
        style: 'success'
    },
    info: {
        icon: <Icons.InfoCircle />,
        labelKey: "notifications.info",
        color: "#2196F3",
        style: 'info'
    },
    message: {
        icon: null,
        labelKey: "notifications.message",
        color: "#3A3A3A",
        style: 'message'
    },
};


export const ItemNotification = ({ type, text, onClose }: NotificationProps) => {
    const { t } = useTranslation("common");
    const { icon, labelKey, color, style } = typeConfig[type];

    return (
        <div className={styles.notification}
        style={{borderLeft: "6px solid " + color}}>
            <div className={styles.notification_header}>
                <div className={styles.flex_container}>
                    {icon}
                    <p className={styles[style]}>{t(labelKey)}</p>
                </div>
                <Icons.Close onClick={onClose} strokeColor={color} className={styles.close_button} />
            </div>
            <p className={styles.notification_description}>{text}</p>
        </div>
    );
};