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
import {useTranslation} from "react-i18next"; // если используешь react-router

export const Menu = () => {
    const [open, setOpen] = React.useState(true);
    const {t} = useTranslation('common');
    const location = useLocation();

    const toggleMenu = () => {
        setOpen(!open);
    };

    const menuItems = [
        {path: "/profile", label: t("menu.profile"), icon: MenuProfile},
        {path: "/admin", label: t("menu.administration"), icon: MenuAdmin},
        {path: "/certificates", label: t("menu.certificates"), icon: MenuRef},
        {path: "/usefulservices", label: t("menu.services"), icon: MenuServices},
        {path: "/events", label: t("menu.events"), icon: MenuEvents},
    ];

    return (
        <div className={`${styles.menu} ${open ? styles.menu_open : styles.menu_closed}`}>
            <div className={styles.toggleButtonWrapper}>
                <div onClick={toggleMenu} className={styles.toggleButton}>
                    {open ? <MenuLeft/> : <MenuRight/>}
                </div>
            </div>
            <ol className={styles.menuList}>
                {menuItems.map(({path, label, icon: Icon}) => {
                    const isActive = location.pathname === path;
                    return (
                        <li key={path} className=
                            {`${isActive ? styles.activeItem : ""} ${path === "/admin" ? styles.admin_link : ""}`.trim()}>

                            <NavLink to={path} className={styles.menuLink}>
                                <Icon stroke={isActive ? "#375FFF" : "#000"}/>
                                {open && <span>{label}</span>}
                            </NavLink>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};