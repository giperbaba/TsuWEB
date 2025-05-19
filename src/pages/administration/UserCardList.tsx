import { ProfileShortDto } from "../../services/user.service";
import styles from "./styles/AdminUsersPage.module.css"
import {useTranslation} from "react-i18next";

interface UserCardListProps {
    user: ProfileShortDto;
}

export const UserCardList = ( props: UserCardListProps) => {
    const { t } = useTranslation('common');

    return (
        <div className={styles.user_card_list}>
            <p className={styles.card_header_text}>{props.user.lastName} {props.user.firstName} {props.user.patronymic}</p>
            <div className={styles.user_card_row}>
                <p className={styles.card_base_text}>{t('profile.birthday')}: </p> <p
                className={styles.card_info_text}>{props.user.birthDate}</p>
            </div>
            <div className={styles.user_card_row}>
                <p className={styles.card_base_text}>{t('profile.email')}: </p> <p
                className={styles.card_info_text}>{props.user.email}</p>
            </div>
        </div>
    )
};