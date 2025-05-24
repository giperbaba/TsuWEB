import { useState } from "react";
import styles from "./styles/StatusDropdown.module.css";
import {EventStatus} from "../../services/event.service.ts";
import OpenDropdown from "../../assets/icons/OpenDropdown.tsx";

const statusOptions = [
    { label: "Черновик", value: EventStatus.Draft },
    { label: "Активное", value: EventStatus.Actual },
    { label: "Завершилось", value: EventStatus.Finished },
    { label: "Архив", value: EventStatus.Archive },
];

export default function StatusDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(statusOptions[1]); // по умолчанию "Активное"

    return (
        <div className={styles.dropdownWrapper}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${styles.dropdownButton} ${styles[selected.value.toLowerCase()]}`}
            >
                {selected.label}
                <OpenDropdown></OpenDropdown>
            </button>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {statusOptions.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => {
                                setSelected(status);
                                setIsOpen(false);
                            }}
                            className={`${styles.menuItem} ${styles[status.value.toLowerCase()]}`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
