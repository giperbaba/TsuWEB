import {ItemInput} from "../common/ui/input/ItemInput.tsx";
import {ItemSwitch} from "../common/ui/switch/ItemSwitch.tsx";
import {ItemButton} from "../common/ui/button/ItemButton.tsx";
import {useTranslation} from "react-i18next";
import styles from "./styles/RegistrationForm.module.css";
import {FormEvent, useState} from "react";
import {AuthService} from "../../services/auth.service.ts";
import {useRequest} from "../../hooks/useRequest.ts";
import { useNotification } from "../../context/NotificationContext.tsx";
//import {setCookie} from "../../auth/cookiesService.js";

export const LoginForm = () => {
    const {t} = useTranslation('common');

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const { request } = useRequest();
    const { notify } = useNotification();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await request(
            AuthService.login({ email, password, rememberMe }).then(res => res.data),
            {
                errorMessage: t("notifications.login_failed"),
                onSuccess: (data) => {
                    if (data.loginSucceeded) {
                        //setCookie('accessToken', data.accessToken);
                        //setCookie('refreshToken', data.refreshToken);
                        notify("success", t("notifications.logged_in"));
                    }
                    else {
                        notify("error", t("notifications.login_failed"));
                    }
                }
            }
        );
    };

    return (
        <form className={styles.registration_form} onSubmit={handleLogin}>
            <h1 className={styles.title}>{t('titles.login')}</h1>
            <ItemInput
                label={t('labels.username')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

            <ItemInput
                label={t('labels.password')}
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                />
            <ItemSwitch label={t('labels.remember_me')}
                        checked={rememberMe}
                        onChange={(checked) => setRememberMe(checked)}
            />
            <ItemButton variant="primary">
                {t('buttons.submit')}
            </ItemButton>
        </form>
    );
}