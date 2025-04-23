import styles from "./styles/LanguageDropdown.module.css";
import UkIcon from "../../assets/icons/UkIcon.tsx";
import { Icons } from "../../assets/icons";
import { Language } from "../../models/enum/Language.ts";


interface LanguageDropdownProps {
    changeLanguage: (language: Language) => void;
}

export const LanguageDropdown = (props: LanguageDropdownProps) => {

    return(
            <ul className={styles.dropdown_menu}>

                <li className={styles.dropdown_li} onClick={() => props.changeLanguage(Language.en)} data-first>
                    <label htmlFor={styles.icon} className={styles.label}>English</label>
                    <UkIcon width={34} height={20} id={styles.icon}></UkIcon>
                </li>

                <li className={styles.dropdown_li} onClick={() => props.changeLanguage(Language.ru)}>
                    <label htmlFor={styles.icon} className={styles.label}>Русский</label>
                    <Icons.RusIcon width={34} height={20} id={styles.icon}></Icons.RusIcon>
                </li>

            </ul>
    )
}