import styles from "./ItemInput.module.css";

interface ItemInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}

export const ItemInput = (props: ItemInputProps) => {
    return(<div className={styles.input_container}>
            <label className={styles.label}>{props.label}</label>
            <input className={styles.item_input}
                   value={props.value}
                   type={props.type}
                   onChange={props.onChange}
                   placeholder={props.placeholder}
            min={1}></input>

        </div>
    )
}