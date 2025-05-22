import styles from "./ItemButton.module.css"
import React from "react";

class Options {
    isDisabled: string | undefined;
    something: boolean | undefined;

    constructor(options: Options) {
        this.isDisabled = options.isDisabled;
        this.something = options.something;
    }
}

interface ItemButtonProps {
    variant?: "primary" | "outlined";
    click?: () => void;
    children?: React.ReactNode;
    options?: Options;
    type?: "button" | "submit" | "reset" | undefined;
}

export const ItemButton = ({variant = "primary", children, click, type}: ItemButtonProps) => {
    return(
        <button className={`${styles.button} ${styles[variant]}`} onClick={click} type={type}>
            {children}
        </button>)
}