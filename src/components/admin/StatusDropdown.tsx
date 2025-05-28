import { useState } from "react";
import styles from "./styles/StatusDropdown.module.css";
import {EventStatus} from "../../services/event.service.ts";
import OpenDropdown from "../../assets/icons/OpenDropdown.tsx";

const statusOptions = [
    { label: "Активное", value: EventStatus.Actual },
    { label: "Завершилось", value: EventStatus.Finished },
    { label: "Черновик", value: EventStatus.Draft },
    { label: "Архив", value: EventStatus.Archive },
];

interface StatusDropdownProps {
    value: EventStatus;
    onChange: (status: EventStatus) => void;
}

export default function StatusDropdown({ value, onChange }: StatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selected = statusOptions.find(option => option.value === value) || statusOptions[0];

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
                        (status.label !== selected.label) ?
                        <button
                            key={status.value}
                            onClick={() => {
                                onChange(status.value);
                                setIsOpen(false);
                            }}
                            className={`${styles.menuItem} ${styles[status.value.toLowerCase()]}`}
                        >
                            {status.label}
                        </button> : <></>
                    ))}
                </div>
            )}
        </div>
    );
}
