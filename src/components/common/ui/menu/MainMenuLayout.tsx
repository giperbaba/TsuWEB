import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "./Menu.tsx";
import styles from "./MainMenuLayout.module.css";
import {LanguageSwitcher} from "../../../auth/LanguageSwitcher.tsx";

export const MainMenuLayout = () => {
    const location = useLocation();
    const hideMenuPaths = ["/login", "/internalservererror"]; // можно добавить еще

    const shouldHideMenu = hideMenuPaths.includes(location.pathname) || location.pathname === "*";

    return (
        <div className={styles.main_menu}>
            {!shouldHideMenu && <Menu />}
            <div className={styles.content}>
                <Outlet />
            </div>
            <LanguageSwitcher/>
        </div>
);
};