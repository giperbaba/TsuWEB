import ReactSwitch from "react-switch";
import styles from "./ItemSwitch.module.css";

interface ItemSwitchProps {
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const ItemSwitch = (props: ItemSwitchProps) => {
    return(
        <div className={styles.switch_container}>
        <ReactSwitch
                     checked={props.checked}
                     uncheckedIcon={false}
                     checkedIcon={false}
                     onColor={"#375FFF"}
                     boxShadow={"#375FFF1F"}
                     activeBoxShadow={"0 0 0px 3px #3A3A3A14"}
                     offColor={"#B5B5B5"}
                     width={45}
                     height={23}
                     borderRadius={100}
                     handleDiameter={18}
                     onChange={props.onChange}
                     className={styles.item_switch}
                     id={styles.item_switch}></ReactSwitch>

            <label htmlFor={styles.item_switch} className={styles.label}>{props.label}</label>
        </div>
    )
}