import {useEffect, useState} from "react";
import {
    EmployeePostDto,
    ExperienceDto,
    ProfileService
} from "../../services/profile.service.ts";
import {useTranslation} from "react-i18next";
import styles from "./styles/EmployeeBlock.module.css";
import {PostCard} from "./PostCard.tsx";

export const EmployeeBlock=  () => {
    const {t} = useTranslation('common');
    const [experience, setExperience] = useState<ExperienceDto[]>([]);
    const [posts, setPosts] = useState<EmployeePostDto[]>([]);

    useEffect(() => {
        ProfileService.getEmployeeInfo().then((response) => {
            setExperience(response.data.experience);
            setPosts(response.data.posts)
        });
    }, []);

    return (
        <div>
            <div className={styles.item_post}>
                <p className={styles.bold_text}>{t('employee.experience')}</p>
                {experience.map((exp => (
                    <div className={styles.section_container}>
                        <div className={styles.section_item_block}>
                            <div className={styles.section_name_text}>{exp.type}</div>
                            <div className={styles.section_base_text}>{exp.years ? exp.years % 5 == 0 ? exp.years.toString() + " лет" : exp.years.toString() + " года" : "0 лет"} {exp.months ? exp.months : "0 месяцев"}</div>
                        </div>
                    </div>
                )))}

            </div>

            <div className={styles.posts}>
                {posts.map((post) => (
                    <PostCard key={post.id} post={post}/>
                ))}
            </div>
        </div>
    );
}