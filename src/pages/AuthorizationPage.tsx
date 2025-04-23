import {LanguageSwitcher} from "../components/auth/LanguageSwitcher.tsx";
import {LoginForm} from "../components/auth/LoginForm.tsx";
import { Icons } from "../assets/icons"
import styles from "./styles/AuthorizationPage.module.css"

export const AuthorizationPage = () => {
    return(
        <div className={styles.auth_page}>
                <Icons.AuthImg className={styles.img}></Icons.AuthImg>
                <LoginForm/>

            <LanguageSwitcher/>
        </div>
    );
}