import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "./Menu.tsx";
import styles from "./MainMenuLayout.module.css";
import { LanguageSwitcher } from "../../../auth/LanguageSwitcher.tsx";
import { useMenu } from "../../../../context/MenuContext.tsx";
import MenuSmall from "../../../../assets/icons/MenuSmall";

export const MainMenuLayout = () => {
    const location = useLocation();
    const { isMenuOpen, toggleMenu, isMobile } = useMenu();

    const hideMenuPaths = ["/login", "/internalservererror"];
    const shouldHideMenu = hideMenuPaths.includes(location.pathname);

    const showMobileMenu = isMobile && isMenuOpen;
    const showDesktopMenu = !isMobile && isMenuOpen;

    return (
        <div className={styles.main_menu}>
            {!shouldHideMenu && showDesktopMenu && <Menu />}

            {!shouldHideMenu && isMobile && (
                <>
                    {!isMenuOpen && (
                        <div className={styles.menu_icon_wrapper} onClick={toggleMenu}>
                            <MenuSmall />
                        </div>
                    )}
                    {isMenuOpen && (
                        <>
                            <div className={styles.overlay} onClick={toggleMenu} />
                            <div className={styles.mobile_menu}>
                                <Menu />
                            </div>
                        </>
                    )}
                </>
            )}

            <div className={`${styles.content} ${showMobileMenu ? styles.dimmed : ""}`}>
                <Outlet />
            </div>

            <LanguageSwitcher />
        </div>
    );
};