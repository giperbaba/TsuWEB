import {ItemButton} from "../components/common/ui/button/ItemButton.tsx";
import styles from "./styles/ErrorPage.module.css"
import {useNavigate} from "react-router-dom";

interface ErrorPageProps {
    errorCode: '404' | '500';
}

const typeConfig = {
    "404": {
        text: "Page not Found",
        translate: "Страница не найдена",
        description: ["Вероятно такой страницы не существует или вы ошиблись", "при вводе адреса в строку браузера"],
        info: ""
    },
    "500": {
        text: "Internal Server Error",
        translate: "Ошибка сервера",
        description: ["Возможно на сервере произошла внутренняя ошибка", "или проводятся кратковременные, технические работы!"],
        info: "Пожалуйста сообщите нам об этой проблеме"
    },
};

export const ErrorPage = (props: ErrorPageProps) => {
    const navigate = useNavigate();
    const { text, translate, description, info } = typeConfig[props.errorCode];

    return (
        <div className={styles.error_page}>
            <h1 className={styles.error_code_text}>{props.errorCode}</h1>
            <>
                <div className={styles.header}>
                    <div>
                        <p className={styles.error_text}>{text}</p>
                        <p className={styles.error_text}>{translate}</p>
                    </div>
                    <ItemButton variant={"primary"} click={() => navigate("/profile")}>Вернуться на главную</ItemButton>
                </div>
            </>

            <div className={styles.footer}>
                <p className={styles.what_happened_text}>Что случилось?</p>
                <div>
                {description.map((line, index) => (
                    <p key={index} className={styles.desc_text}>{line}</p>
                ))}
                </div>
                <p className={styles.info_text}>{info}</p>
            </div>


            <h2 className={`${styles.error_line} ${styles.line1}`}>Ошибка    Ошибка      Ошибка      Ошибка      Ошибка      Ошибка      Ошибка</h2>
            <h2 className={`${styles.error_line} ${styles.line2}`}>Ошибка     Ошибка     Ошибка      Ошибка      Ошибка      Ошибка      Ошибка      Ошибка
                Ошибка      Ошибка      Ошибка      Ошибка      Ошибка    </h2>
        </div>

    );
}

