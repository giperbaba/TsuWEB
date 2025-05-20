import React from "react";
import styles from "./Menu.module.css";
import MenuProfile from "../../../../assets/icons/MenuProfile";
import MenuAdmin from "../../../../assets/icons/MenuAdmin";
import MenuRef from "../../../../assets/icons/MenuRefs";
import MenuServices from "../../../../assets/icons/MenuServices";
import MenuEvents from "../../../../assets/icons/MenuEvents";
import MenuLeft from "../../../../assets/icons/MenuLeft";
import MenuRight from "../../../../assets/icons/MenuRight";
import {NavLink, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useProfile} from "../../../../context/ProfileContext.tsx";
import {useMenu} from "../../../../context/MenuContext.tsx";

export const Menu = () => {
    const [open, setOpen] = React.useState(true);
    const {t} = useTranslation('common');
    const location = useLocation();
    const { avatarUrl } = useProfile();
    const { isMobile, toggleMenu } = useMenu();

    const handleToggleMenu = () => {
        if (isMobile) {
            toggleMenu();
        }
        else {
            setOpen(prev => !prev);
        }
    };

    const menuItems = [
        {path: "/profile", label: t("menu.profile"), icon: MenuProfile},
        {path: "/admin", label: t("menu.administration"), icon: MenuAdmin},
        {path: "/certificates", label: t("menu.certificates"), icon: MenuRef},
        {path: "/usefulservices", label: t("menu.services"), icon: MenuServices},
        {path: "/events", label: t("menu.events"), icon: MenuEvents},
    ];

    const pathsWithSubroutes = ["/admin"];

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
            <div className={styles.toggleButtonWrapper}></div>


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