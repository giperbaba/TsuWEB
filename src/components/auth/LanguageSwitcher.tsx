import React from "react";
import styles from "./styles/LanguageSwitcher.module.css"
import {Language} from "../../models/enum/Language.ts";
import UkIcon from "../../assets/icons/UkIcon.tsx";
import {LanguageDropdown} from "./LanguageDropdown.tsx";
import {useTranslation} from "react-i18next";
import {Icons} from "../../assets/icons";

export const LanguageSwitcher = () => {
    const {i18n, t} = useTranslation('common');
    const [isOpen, setIsOpen] = React.useState(false);

    const currentLanguage = i18n.language === 'ru' ? Language.ru : Language.en;

    const toggleOpen = () => setIsOpen(!isOpen);

    const changeLanguage = (language: Language) => {
        i18n.changeLanguage(language === Language.ru ? 'ru' : 'en').then(() => setIsOpen(false));
    };

    return (
        <div className={styles.language_switcher}>
            <div className={styles.switcher_title}>
                {currentLanguage === Language.ru ? (
                    <>
                        <label htmlFor={styles.icon} className={styles.label}>
                            {t('languages.ru')}
                        </label>
                        <Icons.RusIcon width={34} height={20} id={styles.icon}/>
                    </>
                ) : (
                    <>
                        <label htmlFor={styles.icon} className={styles.label}>
                            {t('languages.en')}
                        </label>
                        <UkIcon width={34} height={20} id={styles.icon}/>
                    </>
                )}
                <Icons.ChevronDown
                    onClick={toggleOpen}
                    style={{cursor: "pointer"}}
                />
            </div>
            {isOpen && <LanguageDropdown changeLanguage={changeLanguage}/>}
        </div>
    );
};