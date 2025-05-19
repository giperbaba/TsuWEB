import {ProfileShortDto} from "../../services/user.service.ts";
import styles from "../../pages/administration/styles/AdminUsersPage.module.css"

export const UserCard = ({ user }: { user: ProfileShortDto }) => (
    <div className={styles.user_card}>
        <div className={styles.card_header}>
            <h3>{user.lastName} {user.firstName} {user.patronymic}</h3>
        </div>
        <div className={styles.card_body}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Birth Date:</strong> {user.birthDate}</p>
        </div>
    </div>
);