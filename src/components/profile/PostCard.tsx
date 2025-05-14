import {EmployeePostDto} from "../../services/profile.service.ts";
import styles from "./styles/EmployeeBlock.module.css";
import {useTranslation} from "react-i18next";

interface PostCardProps {
    post: EmployeePostDto;
}

export const PostCard = (props: PostCardProps) => {
    const {t} = useTranslation('common');

    const employmentTypeMap: Record<string, string> = {
        MainPlace: 'Основное место работы',
        PartTime: 'Неполный рабочий день',
        InnerPartTime: 'Внутренний неполный рабочий день',
        Freelance: 'Фриланс',
    };


    return(
        <div className={styles.item_post}>
            <h2 className={styles.bold_text}>{props.post.postName.name}</h2>

            <div className={styles.section_container}>
                <div className={styles.section_row}>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t('employee.view')}</div>
                        <div className={styles.section_base_text}>
                            {employmentTypeMap[props.post.employmentType] || 'Неизвестно'}
                        </div>
                    </div>

                    <div className={styles.section_item_block}>
                    <div className={styles.section_name_text}>{t('employee.rate')}</div>
                        <div className={styles.section_base_text}>{props.post.rate}</div>
                    </div>
                </div>

                <div className={styles.section_item_block}>
                    <div className={styles.section_name_text}>{t('employee.place')}</div>
                    <div className={styles.section_base_text}>{props.post.departments.map((department) => (
                        <div>{department.name}</div>))}</div>
                </div>

                <div className={styles.section_item_block}>
                    <div className={styles.section_name_text}>{t('employee.type')}</div>
                    <div className={styles.section_base_text}>{props.post.postType.name}</div>
                </div>

                <div className={styles.section_row}>
                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t('employee.date_start')}</div>
                        <div className={styles.section_base_text}>{props.post.dateStart}</div>
                    </div>

                    <div className={styles.section_item_block}>
                        <div className={styles.section_name_text}>{t('employee.date_end')}</div>
                        <div className={styles.section_base_text}>{props.post.dateEnd}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}