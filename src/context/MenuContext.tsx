import React, { createContext, useContext, useState, useEffect } from "react";

type MenuContextType = {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    isMobile: boolean;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1200;
            setIsMobile(mobile);
            setIsMenuOpen(!mobile);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <MenuContext.Provider value={{ isMenuOpen, toggleMenu, isMobile }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
};