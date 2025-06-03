import React, {JSX} from "react";
import styles from "./Menu.module.css";
import MenuProfile from "../../../../assets/icons/MenuProfile";
import MenuAdmin from "../../../../assets/icons/MenuAdmin";
import MenuRef from "../../../../assets/icons/MenuRefs";
import MenuServices from "../../../../assets/icons/MenuServices";
import MenuEvents from "../../../../assets/icons/MenuEvents";
import MenuLeft from "../../../../assets/icons/MenuLeft";
import MenuRight from "../../../../assets/icons/MenuRight";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useProfile} from "../../../../context/ProfileContext.tsx";
import {useMenu} from "../../../../context/MenuContext.tsx";
import {getAccessToken, removeAccessToken, removeRefreshToken} from "../../../../auth/cookiesService.ts";
import {parseJwt} from "../../../../api/instance.ts";
import SvgLogout from "../../../../assets/icons/Logout.tsx";
import {AuthService} from "../../../../services/auth.service.ts";
import {useRequest} from "../../../../hooks/useRequest.ts";

export const Menu = () => {
    const [open, setOpen] = React.useState(true);
    const {t} = useTranslation('common');
    const location = useLocation();
    const { avatarUrl } = useProfile();
    const { isMobile, toggleMenu } = useMenu();

    const token = getAccessToken();
    const parsedToken = token ? parseJwt(token) : null;
    const isAdmin = parsedToken?.role.toString().toLowerCase() === "admin";

    const navigate = useNavigate();
    const { request } = useRequest();

    const handleToggleMenu = () => {
        if (isMobile) {
            toggleMenu();
        }
        else {
            setOpen(prev => !prev);
        }
    };

    interface MenuItem {
        path: string;
        label: string;
        icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    }

    const menuItems: MenuItem[] = [
        { path: "/profile", label: t("menu.profile"), icon: MenuProfile },
        isAdmin && { path: "/admin", label: t("menu.administration"), icon: MenuAdmin },
        { path: "/certificates", label: t("menu.certificates"), icon: MenuRef },
        { path: "/usefulservices", label: t("menu.services"), icon: MenuServices },
        { path: "/events", label: t("menu.events"), icon: MenuEvents },
    ].filter((item): item is MenuItem => Boolean(item));
    const pathsWithSubroutes = ["/admin", "/events"];

    const logout = async () => {
        try {
            await request(AuthService.logout(), {
                successMessage: t("common.success_logout")
            })
            await AuthService.revoke();

            removeAccessToken();
            removeRefreshToken();

            navigate("/login");

        } catch (error) {
            console.error("Ошибка при выходе из системы:", error);
        }
    }

    return (
        <div className={`${styles.menu} ${open ? styles.menu_open : styles.menu_closed}`}>
            <div className={styles.toggleButtonWrapper}>
                <div className={styles.menu_avatar_wrapper}>
                    <img src={avatarUrl} alt="avatar" className={styles.menu_avatar}/>
                </div>

                <div onClick={handleToggleMenu} className={styles.toggleButton}>
                    {isMobile ? <MenuLeft/> : open ? <MenuLeft/> : <MenuRight/>}
                </div>
            </div>
            <div className={styles.toggleButtonWrapper}>
                <button className={styles.logout_button}
                        onClick={logout}
                >
                    <p className={styles.logout_text}>{t("common.logout")}</p>
                    <SvgLogout/>
                </button>
            </div>


            <ol className={styles.menuList}>
                {menuItems.map(({path, label, icon: Icon}) => {
                    const isActive = pathsWithSubroutes.some(p => path.startsWith(p))
                        ? location.pathname.startsWith(path)
                        : location.pathname === path;
                    return (
                        <li key={path} className={isActive ? styles.activeItem : ""}>
                            <NavLink to={path} className={styles.menuLink} onClick={isMobile ? toggleMenu : undefined}>
                                <Icon
                                    stroke={isActive ? "#375FFF" : "#000"}
                                    enableBackground={isActive ? "#375FFF1A" : "#000"}
                                />
                                {open && <span>{label}</span>}
                            </NavLink>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};