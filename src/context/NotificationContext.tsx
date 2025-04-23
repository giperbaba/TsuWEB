import {createContext, ReactNode, useContext, useState} from "react";
import {ItemNotification} from "../components/common/ui/notification/ItemNotification";
import styles from "./NotificationContext.module.css"

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'message';

interface Notification {
    id: number;
    type: NotificationType;
    text: string;
}

interface NotificationContextProps {
    notify: (type: NotificationType, text: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within a NotificationProvider");
    return context;
};

let idCounter = 0;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = (type: NotificationType, text: string) => {
        const id = idCounter++;
        setNotifications((prev) => [...prev, { id, type, text }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 8000);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className={styles.notifications}>
                {notifications.map((n) => (
                    <ItemNotification
                        key={n.id}
                        type={n.type}
                        text={n.text}
                        onClose={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}/>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};